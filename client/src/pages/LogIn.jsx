import { useState, React } from 'react'
import { useNavigate } from 'react-router-dom'


function LogIn({ user, setUser }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showIncorrect, setShowIncorrect] = useState(false)

  const navigate = useNavigate();

  
  function handleLogIn(e) {
    e.preventDefault()
    let user_info = {
      "username": username,
      "password": password
    };
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user_info)
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Invalid credentials');
      }
    })
    .then((res) => {
      setUser(res);
      setShowIncorrect(false);
      navigate("/");
    })
    .catch(() => {
      setShowIncorrect(true);
    });
  };

  return (
      <div>
          <h2>Log In</h2>
          <div>
            {showIncorrect && <div><p>Invalid username or password</p></div>}
              <form onSubmit={(e)=>handleLogIn(e)}>
                  <label>Username:</label>
                  <input 
                  type="text"
                  value={username}
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                  ></input>
                  <label>Password:</label>
                  <input 
                  type="password"
                  value={password}
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  <button onClick={(e) => handleLogIn(e)} type="submit">Log In</button>
              </form>
          </div>
          <button onClick={() => navigate("/signup")}>Sign Up?</button>
      </div>
  )
}

export default LogIn