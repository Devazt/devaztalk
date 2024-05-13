export type User = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  blocked: string[];
}

export type Block = {
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
}

export type UserStore = {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string) => void;
}

export type UserChats = {
  chatId: string;
  isSeen: boolean;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  user: User;
}

export type Message = {
  createdAt: number;
  senderId: string;
  text: string;
  img?: string;
}

export type Chats = {
  createdAt: number;
  messages: Message[];
}

export type ChatProp = {
receiverId: string;
updatedAt: number;
lastMessage: string;
chatId: string;
isSeen: boolean;
}