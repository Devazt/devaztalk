import { create } from "zustand";
import { useUserStore } from "./userStore";
import { User, Block } from "./interface";

export const useChatStore = create()((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId : string, user: User) => {
    const currentUser = useUserStore.getState().currentUser;

    // Check if user is blocked

    if (currentUser && user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }
    // Check if receiver is blocked
    else if (currentUser && currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      // User is not blocked
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }

    changeBlock: () => {
      set((state: Block) => ({
        ...state,
        isReceiverBlocked: !state.isReceiverBlocked,
      }));      
    };    
  },
}));
