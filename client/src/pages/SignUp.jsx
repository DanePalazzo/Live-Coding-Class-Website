import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nameOfUser, setNameOfUser] = useState("")
  const [passwordCompare, setPasswordCompare] = useState(true)

  const navigate = useNavigate();

  function handleSetPassword(pw) {
    setPassword(pw);
    handlePasswordCompare(pw, confirmPassword);
  }

  function handleSetConfirmPassword(pw) {
      setConfirmPassword(pw);
      handlePasswordCompare(password, pw);
  }

  function handlePasswordCompare(pw1, pw2) {
      setPasswordCompare(pw1 === pw2);
  }

  

  return (
    <div>
      <h2>Sign Up</h2>
      <div>
        <form onSubmit={(e) => handleSignUp(e)}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label>Name:</label>
          <input
            type="text"
            value={nameOfUser}
            placeholder='Name'
            onChange={(e) => setNameOfUser(e.target.value)}
          ></input>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => { handleSetPassword(e.target.value) }}
          ></input>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => { handleSetConfirmPassword(e.target.value) }}
          ></input>
          <div>
            {passwordCompare && <p>*Passwords must match.</p>}
          </div>
        </form>
      </div>
      <button onClick={(e) => handleSignUp(e)} type="submit">Sign Up</button>
      <button onClick={() => navigate("/login")}>Log In?</button>
    </div>
  )
}

export default SignUp