import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { User, Chats, ChatProp } from "../../lib/interface";
import { format } from "timeago.js";

interface ChatStoreState {
  chatId: string;
  user: User;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
}

function Chat() {
  const [chat, setChat] = useState<Chats>();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState<{ file: File | null; url: string }>({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore() as ChatStoreState;
  const { currentUser } = useUserStore();

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const data = res.data() as Chats;
      setChat(data);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (emoji: { emoji: string }) => {
    setText((prev) => prev + emoji.emoji);
  };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0]) {
        setImg({
          file:
            e.target.files && e.target.files.length > 0
              ? e.target.files[0]
              : null,
          url:
            e.target.files && e.target.files.length > 0
              ? URL.createObjectURL(e.target.files[0])
              : "",
        });
      }
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser?.id,
          text,
          createdAt: new Date(),
          ...(imgUrl ? { img: imgUrl } : {}),
        }),
      });

      const userIDs = [currentUser?.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id ?? "");
        const userChatsSnapshot = await getDoc(userChatsRef);
        console.log(userChatsSnapshot.data());

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex =
            userChatsData.chats.findIndex(
              (c: ChatProp) => c.chatId === chatId
            ) ?? -1;
          console.log(chatIndex);

          if (chatIndex !== -1) {
            if (!userChatsData.chats) {
              userChatsData.chats = [];
            }

            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser?.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setText("");
      setImg({ file: null, url: "" });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleImg}
            id="file"
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You can't send message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(!open)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
