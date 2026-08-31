/**
 * Message Repository
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Message, CreateMessageDTO, UpdateMessageDTO, PaginationParams, PaginatedResult, MessageStats } from '../types';

export class MessageRepository extends BaseRepository<Message> {
  protected tableName = 'messages';
  protected primaryKey = 'message_id';

  async create(dto: CreateMessageDTO): Promise<Message> {
    const result = await query<Message>(
      `INSERT INTO messages
         (user_id, sender_name, sender_email, sender_phone, subject, message, message_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        dto.user_id ?? null,
        dto.sender_name,
        dto.sender_email,
        dto.sender_phone ?? null,
        dto.subject,
        dto.message,
        dto.message_type ?? 'inquiry',
      ]
    );
    return result.rows[0];
  }

  async update(message_id: string, dto: UpdateMessageDTO, admin_id?: string): Promise<Message | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.status !== undefined)       { fields.push(`status = $${idx++}`);       values.push(dto.status); }
    if (dto.priority !== undefined)     { fields.push(`priority = $${idx++}`);     values.push(dto.priority); }
    if (dto.admin_notes !== undefined)  { fields.push(`admin_notes = $${idx++}`);  values.push(dto.admin_notes); }

    // Auto-set responded_by when status becomes 'responded'
    if (dto.status === 'responded' && admin_id) {
      fields.push(`responded_by = $${idx++}`);
      values.push(admin_id);
      fields.push(`responded_at = CURRENT_TIMESTAMP`);
    }

    if (fields.length === 0) return this.findById(message_id);

    values.push(message_id);
    const result = await query<Message>(
      `UPDATE messages SET ${fields.join(', ')} WHERE message_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async findAll(
    pagination: PaginationParams,
    filters?: { status?: string; priority?: string; message_type?: string; search?: string }
  ): Promise<PaginatedResult<Message>> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.status)       { conditions.push(`status = $${idx++}`);       params.push(filters.status); }
    if (filters?.priority)     { conditions.push(`priority = $${idx++}`);     params.push(filters.priority); }
    if (filters?.message_type) { conditions.push(`message_type = $${idx++}`); params.push(filters.message_type); }
    if (filters?.search) {
      conditions.push(`(sender_name ILIKE $${idx} OR sender_email ILIKE $${idx} OR subject ILIKE $${idx})`);
      params.push(`%${filters.search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows, total] = await Promise.all([
      query<Message>(
        `SELECT m.*, a.full_name as responder_name
         FROM messages m
         LEFT JOIN admins a ON m.responded_by = a.admin_id
         ${where} ORDER BY m.created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(conditions.join(' AND '), params),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async getStats(): Promise<MessageStats> {
    const result = await query<MessageStats>(`SELECT * FROM vw_message_stats`);
    return result.rows[0] ?? {
      unread_count: 0,
      read_count: 0,
      responded_count: 0,
      urgent_count: 0,
      today_count: 0,
    };
  }

  async markRead(message_id: string): Promise<boolean> {
    const result = await query(
      `UPDATE messages SET status = 'read' WHERE message_id = $1 AND status = 'unread'`,
      [message_id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const messageRepository = new MessageRepository();
