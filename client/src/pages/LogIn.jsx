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
      <div className="flex flex-col">
          <h2 className='flex flex-row mx-auto my-3 text-3xl font-bold'>Log In</h2>
          <div className="flex flex-col">
            {showIncorrect && <div><p>Invalid username or password</p></div>}
              <form onSubmit={(e)=>handleLogIn(e)} className="flex flex-col bg-[#111111] p-3 rounded-xl">
                  <label className='flex justify-self-start'>Username:</label>
                  <input 
                  type="text"
                  value={username}
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                  className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-400'
                  ></input>
                  <label className='flex justify-self-start'>Password:</label>
                  <input 
                  type="password"
                  value={password}
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                  className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-400'
                  ></input>
                  <button onClick={(e) => handleLogIn(e)} type="submit" className="btn btn-ghost">Log In</button>
              </form>
          </div>
          <button onClick={() => navigate("/signup")} className="btn btn-ghost">Sign Up?</button>
      </div>
  )
}

export default LogIn