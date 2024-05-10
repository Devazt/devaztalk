import { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";

function Login() {

    const [avatar, setAvatar] = useState<{
        file : File | null,
        url : string
    }>({
        file: null,
        url:""
    })

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files[0]) {
                
                setAvatar({
                    file: e.target.files && e.target.files.length > 0 ? e.target.files[0] : null,
                    url: e.target.files && e.target.files.length > 0 ? URL.createObjectURL(e.target.files[0]) : ""
                })
            }
        }
    }

    const hanleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        toast.success("Login not implemented yet")
    }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={hanleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button>Sign In</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image</label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar}/>
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
