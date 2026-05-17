type ConnectedMessage = {
  sessionKey: string;
};

type SubscribedMessage = {
  eventType: "CHAT" | "DONATION" | "SUBSCRIPTION";
};

type UnsubscribedMessage = {
  eventType: "CHAT" | "DONATION" | "SUBSCRIPTION";
  channelId: string;
};

type RevokedMessage = {
  eventType: "CHAT" | "DONATION" | "SUBSCRIPTION";
  channelId: string;
};

type ConnectedEvent = {
  type: "connected";
  data: ConnectedMessage;
};

type SubscribedEvent = {
  type: "subscribed";
  data: SubscribedMessage;
};

type UnsubscribedEvent = {
  type: "unsubscribed";
  data: UnsubscribedMessage;
};

type RevokedEvent = {
  type: "revoked";
  data: RevokedMessage;
};

export type SystemEvent =
  | ConnectedEvent
  | SubscribedEvent
  | UnsubscribedEvent
  | RevokedEvent;
