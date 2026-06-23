import { 
  type ContactMessage, 
  type InsertContactMessage,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type UploadedFile,
  type InsertUploadedFile
} from "@shared/schema";

export interface IStorage {
  // Contact Messages
  createContactMessage(data: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Conversations
  createConversation(data: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | null>;
  getAllConversations(userId?: string): Promise<Conversation[]>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  
  // Messages
  createMessage(data: InsertMessage): Promise<Message>;
  getMessages(conversationId: string): Promise<Message[]>;
  deleteMessage(id: string): Promise<void>;
  
  // Uploaded Files
  createUploadedFile(data: InsertUploadedFile): Promise<UploadedFile>;
  getUploadedFile(id: string): Promise<UploadedFile | null>;
  getUploadedFilesByConversation(conversationId: string): Promise<UploadedFile[]>;
  deleteUploadedFile(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private contactMessages: ContactMessage[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];
  private uploadedFiles: UploadedFile[] = [];
  private nextContactId = 1;

  // Contact Messages
  async createContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const msg: ContactMessage = {
      ...data,
      id: this.nextContactId++,
      receivedAt: new Date(),
    };
    this.contactMessages.push(msg);
    return msg;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return [...this.contactMessages];
  }

  // Conversations
  async createConversation(data: InsertConversation): Promise<Conversation> {
    const conversation: Conversation = {
      ...data,
      id: crypto.randomUUID(),
      userId: data.userId || "guest",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.find(c => c.id === id) || null;
  }

  async getAllConversations(userId?: string): Promise<Conversation[]> {
    if (userId) {
      return this.conversations.filter(c => c.userId === userId);
    }
    return [...this.conversations];
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation> {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Conversation not found");
    }
    this.conversations[index] = {
      ...this.conversations[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.conversations[index];
  }

  async deleteConversation(id: string): Promise<void> {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index !== -1) {
      this.conversations.splice(index, 1);
      // Also delete related messages and files
      this.messages = this.messages.filter(m => m.conversationId !== id);
      this.uploadedFiles = this.uploadedFiles.filter(f => f.conversationId !== id);
    }
  }

  // Messages
  async createMessage(data: InsertMessage): Promise<Message> {
    const message: Message = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.messages.push(message);
    
    // Update conversation updatedAt
    const conversation = await this.getConversation(data.conversationId);
    if (conversation) {
      await this.updateConversation(conversation.id, { updatedAt: new Date() });
    }
    
    return message;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async deleteMessage(id: string): Promise<void> {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }

  // Uploaded Files
  async createUploadedFile(data: InsertUploadedFile): Promise<UploadedFile> {
    const file: UploadedFile = {
      ...data,
      id: crypto.randomUUID(),
      size: data.size || 0,
      createdAt: new Date(),
    };
    this.uploadedFiles.push(file);
    return file;
  }

  async getUploadedFile(id: string): Promise<UploadedFile | null> {
    return this.uploadedFiles.find(f => f.id === id) || null;
  }

  async getUploadedFilesByConversation(conversationId: string): Promise<UploadedFile[]> {
    return this.uploadedFiles.filter(f => f.conversationId === conversationId);
  }

  async deleteUploadedFile(id: string): Promise<void> {
    const index = this.uploadedFiles.findIndex(f => f.id === id);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }
}

export const storage = new MemStorage();
