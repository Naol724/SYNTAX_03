import { type ContactMessage, type InsertContactMessage } from "@shared/schema";

export interface IStorage {
  createContactMessage(data: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private messages: ContactMessage[] = [];
  private nextId = 1;

  async createContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const msg: ContactMessage = {
      ...data,
      id: this.nextId++,
      receivedAt: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return [...this.messages];
  }
}

export const storage = new MemStorage();
