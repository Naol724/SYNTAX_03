/**
 * AI Chat Service
 * Primary: Grok API (xAI) — when GROK_API_KEY is set
 * Fallback: Smart rule-based responses — always works without API key
 */

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { chatRepository } from '../repositories/chat.repository';
import config from '../config/environment';
import logger from '../utils/logger';
import { AIChatAssistant } from '../types';

// ─── System prompt for Grok ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a helpful AI assistant for Syntax Software Solutions, a full-stack software company based in Addis Ababa, Ethiopia.

Company Info:
- Name: Syntax Software Solutions
- Location: Bole Dembel, Amir Commercial Complex, Addis Ababa, Ethiopia
- Email: syntaxsoftwaresolution@gmail.com
- Phone: +251 945 455 141
- Website: https://syntaxsoftwaresolution.com

Services we offer:
1. Web Development (React, Next.js, Node.js, TypeScript)
2. Mobile App Development (React Native, Flutter)
3. Enterprise Software (custom ERP, CRM systems)
4. Gaming Platforms (web and mobile games)
5. AI-Powered Chatbots & Automation
6. UI/UX Design & Prototyping
7. API Development & Integration
8. Database Design & Optimization

Your role:
- Answer questions about our services, pricing, and portfolio
- Recommend services based on client needs
- Collect project requirements and suggest next steps
- Answer FAQs about our process and timelines
- Always be professional, concise, and helpful
- For specific pricing, direct users to contact us for a custom quote
- Respond in the same language the user writes in`;

// ─── Smart fallback responses ─────────────────────────────────────────────────
const FAQ: { patterns: RegExp[]; response: string }[] = [
  {
    patterns: [/\bservice\b|\boffer\b|\bwhat do you\b|\bhelp with\b/i],
    response: `We offer a full range of software development services:\n\n🌐 **Web Development** — React, Next.js, Node.js\n📱 **Mobile Apps** — iOS & Android (React Native, Flutter)\n🏢 **Enterprise Software** — Custom ERP & CRM systems\n🎮 **Gaming Platforms** — Web & mobile games\n🤖 **AI & Automation** — Chatbots, workflows\n🎨 **UI/UX Design** — Modern, user-friendly designs\n🔗 **API Development** — REST APIs & integrations\n\nWould you like to know more about any specific service?`,
  },
  {
    patterns: [/price|cost|how much|rate|charge|budget|fee|pricing/i],
    response: `Our pricing depends on the project scope, complexity, and timeline. We offer flexible pricing models:\n\n💼 **Fixed Price** — For well-defined projects\n⏱️ **Hourly Rate** — For ongoing development\n🤝 **Retainer** — For long-term partnerships\n\nFor an accurate quote, please contact us:\n📧 syntaxsoftwaresolution@gmail.com\n📞 +251 945 455 141\n\nWe'll respond within 24 hours with a detailed estimate!`,
  },
  {
    patterns: [/portfolio|project|work|example|case study|previous|built/i],
    response: `We've built solutions across various industries including:\n\n🛒 E-Commerce platforms\n🏥 Healthcare management systems\n🎓 Educational platforms (LMS)\n🏨 Hospitality & booking systems\n💰 FinTech & payment platforms\n🎮 Gaming & entertainment apps\n\nVisit our portfolio page to see detailed case studies and live demos: [View Portfolio](/portfolio)\n\nWant us to build something similar for you?`,
  },
  {
    patterns: [/contact|reach|email|phone|call|whatsapp|address|location|where/i],
    response: `You can reach us through multiple channels:\n\n📧 **Email:** syntaxsoftwaresolution@gmail.com\n📞 **Phone:** +251 945 455 141\n📍 **Address:** Bole Dembel, Amir Commercial Complex, Addis Ababa, Ethiopia\n⏰ **Hours:** Monday–Friday, 8AM–6PM EAT\n\nOr fill out our contact form: [Contact Us](/contact)\n\nWe typically respond within a few hours during business days!`,
  },
  {
    patterns: [/timeline|how long|duration|time|deadline|when|delivery/i],    response: `Project timelines vary based on scope:\n\n⚡ **Simple Website** — 1–2 weeks\n🌐 **Business Website** — 2–4 weeks\n🛒 **E-Commerce Platform** — 4–8 weeks\n📱 **Mobile App** — 6–12 weeks\n🏢 **Enterprise System** — 3–6 months\n\nWe always start with a detailed discovery phase to give you an accurate timeline. Want to discuss your specific project?`,
  },
  {
    patterns: [/process|how.*work|steps|methodology|approach|agile|scrum/i],
    response: `Our development process is transparent and collaborative:\n\n1️⃣ **Discovery** — We understand your goals and requirements\n2️⃣ **Planning** — Detailed project roadmap and timeline\n3️⃣ **Design** — UI/UX wireframes and prototypes\n4️⃣ **Development** — Agile sprints with regular updates\n5️⃣ **Testing** — Quality assurance on all platforms\n6️⃣ **Deployment** — Launch to production\n7️⃣ **Support** — Ongoing maintenance and updates\n\nYou get full visibility at every stage!`,
  },
  {
    patterns: [/technology|tech stack|language|framework|react|node|next|flutter|python/i],
    response: `We work with modern, industry-standard technologies:\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS\n**Mobile:** React Native, Flutter\n**Backend:** Node.js, Express.js, Python, Django\n**Database:** PostgreSQL, MongoDB, MySQL, Redis\n**Cloud:** AWS, Google Cloud, Vercel, Render\n**AI/ML:** OpenAI, Grok, TensorFlow\n\nWe choose the best technology for each project's specific needs!`,
  },
  {
    patterns: [/team|developer|staff|who|people|experience|years|skilled/i],
    response: `Our team consists of experienced professionals:\n\n👨‍💻 **Full Stack Developers** — React, Node.js, Python\n📱 **Mobile Developers** — React Native, Flutter\n🎨 **UI/UX Designers** — Figma, Adobe XD\n🧪 **QA Engineers** — Manual & automated testing\n📊 **Project Managers** — Agile methodology\n\nAll our developers have 3+ years of professional experience. Visit our [Team page](/about) to meet them!`,
  },
  {
    patterns: [/support|maintenance|after|launch|update|bug|fix|ongoing/i],
    response: `We provide comprehensive post-launch support:\n\n🛡️ **Bug Fixes** — Quick response to critical issues\n🔄 **Regular Updates** — Keep your software current\n📊 **Performance Monitoring** — 24/7 uptime tracking\n🔒 **Security Patches** — Regular security updates\n📞 **Dedicated Support** — Direct line to your dev team\n\nWe offer flexible maintenance packages. Want to learn more about our support plans?`,
  },
  {
    patterns: [/start|begin|get started|how do i|first step|initiate|kick.?off/i],
    response: `Getting started is easy! Here's how:\n\n1. **Tell us about your project** — Fill out our contact form or send us an email\n2. **Free consultation** — We'll schedule a call to understand your needs\n3. **Proposal** — We'll send you a detailed proposal with timeline and cost\n4. **Agreement** — Sign the contract and we're ready to go!\n5. **Kickoff** — Development begins immediately\n\n🚀 Ready to start? [Contact Us](/contact) and we'll get back to you within 24 hours!`,
  },
  {
    patterns: [/hello|hi|hey|greet|good morning|good afternoon|good evening|howdy/i],
    response: `Hello! 👋 Welcome to Syntax Software Solutions!\n\nI'm your AI assistant, here to help you with information about our services. How can I help you today?\n\nYou can ask me about:\n• Our services and pricing\n• Project timelines\n• Technology stack\n• How to get started\n• Contact information`,
  },
  {
    patterns: [/thank|thanks|appreciate|great|awesome|perfect|excellent|good job/i],
    response: `You're welcome! 😊 We're here to help whenever you need us.\n\nIf you have any more questions or are ready to start your project, don't hesitate to reach out:\n📧 syntaxsoftwaresolution@gmail.com\n📞 +251 945 455 141\n\nHave a great day!`,
  },
  {
    patterns: [/\bai\b|artificial intelligence|machine learning|\bchatbot\b|\bauton/i],
    response: `Yes, we build AI-powered solutions! 🤖\n\n**Our AI Services:**\n• Custom AI chatbots (like this one!)\n• Natural Language Processing (NLP)\n• Machine learning model integration\n• Recommendation systems\n• Automated workflows & RPA\n• Computer vision applications\n\nWe work with OpenAI, Google AI, and other leading AI platforms. Interested in adding AI to your business?`,
  },
  {
    patterns: [/mobile|app|ios|android|phone|tablet/i],
    response: `We build high-quality mobile apps! 📱\n\n**Mobile Development:**\n• Cross-platform (React Native, Flutter) — one codebase for iOS & Android\n• Native performance with beautiful UI\n• Offline support & push notifications\n• App Store & Play Store deployment\n• Integration with backend APIs\n\n**Industries we've served:**\n• E-commerce apps\n• Healthcare apps\n• Food delivery platforms\n• Educational apps\n\nWant to build a mobile app? Tell us your idea!`,
  },
];

const DEFAULT_RESPONSE = `I'd be happy to help! Could you please provide more details about what you're looking for?\n\nYou can ask me about:\n• Our **services** and what we offer\n• **Pricing** and project costs\n• **Portfolio** and past projects\n• **Process** and how we work\n• **Timeline** and delivery estimates\n• **Contact** information\n\nOr visit our website sections directly for more info! 😊`;

// ─── Service class ────────────────────────────────────────────────────────────
export class ChatService {
  private readonly hasGrokKey: boolean;

  constructor() {
    this.hasGrokKey = !!(config.grok.apiKey && config.grok.apiKey.length > 10);
    if (!this.hasGrokKey) {
      logger.info('Chat service running in smart-fallback mode (no GROK_API_KEY set)');
    }
  }

  // ─── Public: send message ──────────────────────────────────────────────────
  async sendMessage(
    input: { message: string; session_id?: string; context?: any },
    userId?: string
  ): Promise<AIChatAssistant> {
    const sessionId = input.session_id ?? uuidv4();
    const startTime = Date.now();

    const aiResponse = this.hasGrokKey
      ? await this.callGrokAPI(input.message, sessionId)
      : this.smartFallback(input.message);

    return chatRepository.create({
      session_id: sessionId,
      user_id: userId,
      user_message: input.message,
      ai_response: aiResponse,
      response_time_ms: Date.now() - startTime,
      context: input.context,
    });
  }

  // ─── Public: streaming ────────────────────────────────────────────────────
  async sendMessageStream(
    input: { message: string; session_id?: string; context?: any },
    res: Response,
    userId?: string
  ): Promise<void> {
    const sessionId = input.session_id ?? uuidv4();
    const startTime = Date.now();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'session', session_id: sessionId })}\n\n`);

    if (!this.hasGrokKey) {
      // Simulate streaming for fallback (character by character)
      const response = this.smartFallback(input.message);
      const words = response.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ type: 'token', content: word + ' ' })}\n\n`);
        await new Promise((r) => setTimeout(r, 30)); // 30ms per word feels natural
      }
      await chatRepository.create({
        session_id: sessionId, user_id: userId,
        user_message: input.message, ai_response: response,
        response_time_ms: Date.now() - startTime,
      });
      res.write(`data: ${JSON.stringify({ type: 'done', session_id: sessionId })}\n\n`);
      res.end();
      return;
    }

    // Real Grok streaming
    let fullResponse = '';
    try {
      const history = await chatRepository.findBySession(sessionId, 8);
      const messages = this.buildMessageHistory(history as any[], input.message);
      const response = await fetch(`${config.grok.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.grok.apiKey}` },
        body: JSON.stringify({ model: config.grok.model, messages, max_tokens: 1024, temperature: 0.7, stream: true }),
      });

      if (!response.ok || !response.body) {
        const fallback = this.smartFallback(input.message);
        res.write(`data: ${JSON.stringify({ type: 'token', content: fallback })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done', session_id: sessionId })}\n\n`);
        res.end();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter((l) => l.startsWith('data: '))) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content ?? '';
            if (content) { fullResponse += content; res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`); }
          } catch { /* skip malformed */ }
        }
      }
      await chatRepository.create({ session_id: sessionId, user_id: userId, user_message: input.message, ai_response: fullResponse, response_time_ms: Date.now() - startTime });
      res.write(`data: ${JSON.stringify({ type: 'done', session_id: sessionId })}\n\n`);
      res.end();
    } catch (err) {
      logger.error('Stream error', { error: (err as Error).message });
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream failed' })}\n\n`);
      res.end();
    }
  }

  async submitFeedback(chat_id: string, was_helpful: boolean, feedback?: string) {
    return chatRepository.updateFeedback(chat_id, { was_helpful, feedback });
  }

  async getSessionHistory(session_id: string) {
    return chatRepository.findBySession(session_id);
  }

  async clearSession(session_id: string) {
    return chatRepository.clearSession(session_id);
  }

  // ─── Private: smart fallback ───────────────────────────────────────────────
  private smartFallback(message: string): string {
    const normalized = message.toLowerCase().trim();
    for (const faq of FAQ) {
      if (faq.patterns.some((p) => p.test(normalized))) {
        return faq.response;
      }
    }
    return DEFAULT_RESPONSE;
  }

  // ─── Private: call Grok API ────────────────────────────────────────────────
  private async callGrokAPI(message: string, sessionId: string): Promise<string> {
    try {
      const history = await chatRepository.findBySession(sessionId, 8);
      const messages = this.buildMessageHistory(history as any[], message);
      const response = await fetch(`${config.grok.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.grok.apiKey}` },
        body: JSON.stringify({ model: config.grok.model, messages, max_tokens: 1024, temperature: 0.7 }),
      });
      if (!response.ok) throw new Error(`Grok API error: ${response.status}`);
      const data = (await response.json()) as any;
      return data.choices?.[0]?.message?.content ?? this.smartFallback(message);
    } catch (err) {
      logger.warn('Grok API failed, using fallback', { error: (err as Error).message });
      return this.smartFallback(message);
    }
  }

  private buildMessageHistory(history: any[], newMessage: string) {
    return [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.flatMap((h) => [
        { role: 'user', content: h.user_message },
        { role: 'assistant', content: h.ai_response },
      ]),
      { role: 'user', content: newMessage },
    ];
  }
}

export const chatService = new ChatService();
