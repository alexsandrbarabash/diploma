// Todo fix type
export interface Context {
  update: {
    update_id: number;
    callback_query: {
      id: string;
      from: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
        language_code: string;
      };
      message: {
        message_id: number;
        from: {
          id: number;
          is_bot: boolean;
          first_name: string;
          username: string;
        };
        chat: {
          id: number;
          first_name: string;
          username: string;
          type: string;
        };
        date: number;
        text: string;
        reply_markup: {
          inline_keyboard: Array<
            Array<{
              text: string;
              callback_data: string;
            }>
          >;
        };
      };
      chat_instance: string;
      data: string;
    };
    message: {
      text: string;
      message_id: number;
      from: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
        language_code: string;
      };
      chat: {
        id: number;
        first_name: string;
        username: string;
        type: string;
      };
      date: number;
      document?: {
        file_name: string;
        mime_type: string;
        thumb: {
          file_id: string;
          file_unique_id: string;
          file_size: number;
          width: number;
          height: number;
        };
        file_id: string;
        file_unique_id: string;
        file_size: number;
      };
    };
  };
  telegram: {
    token: string;
  };
  botInfo: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
  };
  state: object;
  replyWithDocument(params: {
    source: Buffer | string;
    filename: string;
  }): void;
  reply(mesage: string);
}
