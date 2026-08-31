/**
 * Message Service — Business Logic
 */

import { messageRepository } from '../repositories/message.repository';
import { NotFoundError } from '../utils/errors';
import { Message, CreateMessageDTO, UpdateMessageDTO, PaginationParams, PaginatedResult, MessageStats } from '../types';

export class MessageService {
  async create(dto: CreateMessageDTO): Promise<Message> {
    return messageRepository.create(dto);
  }

  async update(message_id: string, dto: UpdateMessageDTO, admin_id?: string): Promise<Message> {
    const msg = await messageRepository.update(message_id, dto, admin_id);
    if (!msg) throw new NotFoundError('Message');
    return msg;
  }

  async delete(message_id: string): Promise<void> {
    const deleted = await messageRepository.delete(message_id);
    if (!deleted) throw new NotFoundError('Message');
  }

  async getById(message_id: string): Promise<Message> {
    const msg = await messageRepository.findById(message_id);
    if (!msg) throw new NotFoundError('Message');
    // Auto-mark as read when opened
    await messageRepository.markRead(message_id).catch(() => {});
    return msg;
  }

  async getAll(
    pagination: PaginationParams,
    filters?: { status?: string; priority?: string; message_type?: string; search?: string }
  ): Promise<PaginatedResult<Message>> {
    return messageRepository.findAll(pagination, filters);
  }

  async getStats(): Promise<MessageStats> {
    return messageRepository.getStats();
  }

  async archive(message_id: string, admin_id: string): Promise<Message> {
    return this.update(message_id, { status: 'archived' as any }, admin_id);
  }
}

export const messageService = new MessageService();
