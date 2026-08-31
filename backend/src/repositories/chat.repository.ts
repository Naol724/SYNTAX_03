/**
 * AI Chat Repository
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { AIChatAssistant, CreateAIChatDTO, UpdateAIChatDTO } from '../types';

export class ChatRepository extends BaseRepository<AIChatAssistant> {
  protected tableName = 'ai_chat_assistant';
  protected primaryKey = 'chat_id';

  async create(dto: CreateAIChatDTO): Promise<AIChatAssistant> {
    const result = await query<AIChatAssistant>(
      `INSERT INTO ai_chat_assistant
         (user_id, session_id, user_message, ai_response, context, response_time_ms, tokens_used)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        dto.user_id ?? null,
        dto.session_id,
        dto.user_message,
        dto.ai_response,
        dto.context ? JSON.stringify(dto.context) : null,
        dto.response_time_ms ?? null,
        dto.tokens_used ?? null,
      ]
    );
    return result.rows[0];
  }

  async updateFeedback(chat_id: string, dto: UpdateAIChatDTO): Promise<AIChatAssistant | null> {
    const result = await query<AIChatAssistant>(
      `UPDATE ai_chat_assistant SET was_helpful = $1, feedback = $2
       WHERE chat_id = $3 RETURNING *`,
      [dto.was_helpful ?? null, dto.feedback ?? null, chat_id]
    );
    return result.rows[0] ?? null;
  }

  async findBySession(session_id: string, limit: number = 20): Promise<AIChatAssistant[]> {
    const result = await query<AIChatAssistant>(
      `SELECT * FROM ai_chat_assistant WHERE session_id = $1
       ORDER BY created_at ASC LIMIT $2`,
      [session_id, limit]
    );
    return result.rows;
  }

  async clearSession(session_id: string): Promise<void> {
    await query('DELETE FROM ai_chat_assistant WHERE session_id = $1', [session_id]);
  }
}

export const chatRepository = new ChatRepository();
