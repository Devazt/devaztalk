import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { useState } from "react"

function Chat() {

  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const handleEmoji = (emoji: { emoji: string }) => {
    setText(prev => prev + emoji.emoji)
  }
  
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
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
        <div className="message own">
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, quasi corporis quisquam deleniti rem natus expedita accusamus autem repellendus omnis fugit sit quas ipsum a cupiditate modi odio ab voluptatum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, quasi corporis quisquam deleniti rem natus expedita accusamus autem repellendus omnis fugit sit quas ipsum a cupiditate modi odio ab voluptatum.</p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <img src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350
" alt="" />
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, quasi corporis quisquam deleniti rem natus expedita accusamus autem repellendus omnis fugit sit quas ipsum a cupiditate modi odio ab voluptatum.</p>
            <span>1 min ago</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(!open)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  )
}

export default Chat