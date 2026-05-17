export interface ChatEvent {
  channelId: string;
  chatChannelId: string;
  content: string;
  emojis: [];
  eventSentAt: string;
  messageTime: number;
  profile: {
    badges: [];
    nickname: string;
    userRoleCode: string;
    verifiedMark: boolean;
  };
  senderChannelId: string;
}
