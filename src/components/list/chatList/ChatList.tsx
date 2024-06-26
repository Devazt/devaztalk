import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { User, UserChats } from "../../../lib/interface";

interface ChatStoreState {
  changeChat: (chatId: string, user: User) => void;
}

function ChatList() {
  const [chats, setChats] = useState<UserChats[]>([]);
  const [addMode, setAddmode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore() as ChatStoreState;

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser?.id ?? ""),
      async (res) => {
        const items = res.data()?.chats;

        const promises = items.map(async (item: UserChats) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const handleSelect = async (chat: UserChats) => {
    const userChats = chats.map((item) => {
      const { ...rest } = item;

      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser?.id ?? "");

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    return chat.user.username.toLowerCase().includes(input.toLowerCase());
  });

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddmode(!addMode)}
        />
      </div>
      {filteredChats.map((chat: UserChats) => (
        <div
          className="item"
          key={chat?.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser?.id ?? "")
                ? "./avatar.png"
                : chat?.user?.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser?.id ?? "")
                ? "User"
                : chat?.user?.username}
            </span>
            <p>{chat?.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
