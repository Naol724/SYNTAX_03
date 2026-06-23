import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactMessageSchema, insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { generateChatResponse, analyzeUploadedFile } from "./services/openai";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|pdf|txt|html|css|js|jsx|ts|tsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only images, videos, and code files are allowed."));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {

  // POST /api/contact — submit a contact form message
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid input. Please fill in all required fields.",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const msg = await storage.createContactMessage(result.data);
      res.status(201).json({
        success: true,
        message: "Message received successfully",
        data: msg,
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  });

  // GET /api/messages — retrieve all contact messages (admin/testing)
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  });

  // ========== CHAT/CONVERSATION ROUTES ==========

  // GET /api/conversations — get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const conversations = await storage.getAllConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // POST /api/conversations — create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const result = insertConversationSchema.safeParse({
        ...req.body,
        userId: req.body.userId || "guest",
      });

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const conversation = await storage.createConversation(result.data);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // GET /api/conversations/:id — get a specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // DELETE /api/conversations/:id — delete a conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      await storage.deleteConversation(req.params.id);
      res.json({ success: true, message: "Conversation deleted" });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // GET /api/conversations/:id/messages — get all messages in a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // POST /api/conversations/:id/messages — send a message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { content, category } = req.body;
      const conversationId = req.params.id;

      if (!content || !category) {
        return res.status(400).json({ message: "Content and category are required" });
      }

      // Verify conversation exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content,
        metadata: null,
      });

      // Get conversation history for context
      const previousMessages = await storage.getMessages(conversationId);
      const conversationHistory = previousMessages
        .slice(-10) // Last 10 messages for context
        .map(m => ({ role: m.role, content: m.content }));

      // Generate AI response
      const aiResponse = await generateChatResponse(content, category, conversationHistory);

      // Create assistant message
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.content,
        metadata: {
          hasCode: aiResponse.hasCode,
          codeBlocks: aiResponse.codeBlocks,
          suggestions: aiResponse.suggestions,
        },
      });

      res.json({
        userMessage,
        assistantMessage,
        aiResponse,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
  });

  // GET /api/conversations/:id/export — export conversation as JSON
  app.get("/api/conversations/:id/export", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getMessages(req.params.id);
      const exportData = {
        conversation,
        messages,
        exportedAt: new Date().toISOString(),
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="conversation-${req.params.id}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting conversation:", error);
      res.status(500).json({ message: "Failed to export conversation" });
    }
  });

  // POST /api/upload — upload and analyze a file
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const conversationId = req.body.conversationId || null;

      // Read file for analysis
      const fileBuffer = fs.readFileSync(req.file.path);
      const analysis = await analyzeUploadedFile(fileBuffer, req.file.mimetype, req.file.filename);

      // Store file info in storage
      const uploadedFile = await storage.createUploadedFile({
        conversationId,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        analysis,
      });

      res.json({
        file: {
          id: uploadedFile.id,
          filename: uploadedFile.filename,
          size: uploadedFile.size,
          mimeType: uploadedFile.mimeType,
        },
        analysis,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
