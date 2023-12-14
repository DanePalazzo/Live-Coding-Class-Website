import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function NavLayout({user, setUser}) {

    async function handleLogOut() {
        try {
            await fetch("/api/logout", { method: "DELETE" });
            setUser(null);
            alert("Signed Out");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    //ADD USER HANBURGER FOR ACCOUNT LOG IN AND LOG OUT

    return (
        <div>
            <header>
                <h1>Live Coding Class</h1>
                <nav>
                    <NavLink to='/' >Home</NavLink>
                        {user && <NavLink to='sessionsbrowser'>Your Sessions</NavLink>}
                        {user && <NavLink to='account'>{user._username.toUpperCase()}</NavLink>}
                        {user && <button onClick={handleLogOut}>Log Out</button>}
                        {!user && <NavLink to='login'>Log In</NavLink>}
                        {!user && <NavLink to='signup'>Sign Up</NavLink>}
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
