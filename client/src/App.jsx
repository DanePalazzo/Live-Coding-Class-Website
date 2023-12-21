import { useState, useEffect } from 'react'
import './CSS/App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import NavLayout from './pages/NavLayout'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import SessionRoom from './pages/SessionRoom';
import NotFound from './pages/NotFound';
import SessionsBrowser from './pages/SessionsBrowser';
import Account from './pages/Account';


function App() {
  const [user, setUser] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    fetch("/api/checksession").then((response) => {
      if (response.ok) {
        response.json().then((user) => {setUser(user);});
      }
    });
  }, []);


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavLayout user={user} setUser={setUser}/>}>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="sessionsbrowser" element={<SessionsBrowser user={user} setUser={setUser} sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="login" element={<LogIn user={user} setUser={setUser}/>} />
        <Route path="signup" element={<SignUp user={user}/>} />
        <Route path="sessionroom" element={<SessionRoom user={user} sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  // return (
  //   <div className='bg-fit-screen'>
  //     <RouterProvider router={router} />
  //   </div>
  // )



  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
