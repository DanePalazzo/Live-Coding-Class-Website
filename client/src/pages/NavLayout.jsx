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

    return (
        <div>
            <header>
                <h1>Live Coding Class</h1>
                <nav>
                    <NavLink to='/' >Home</NavLink>
                        <NavLink to='sessionbrowser'>Session Browser</NavLink>
                        {!user && <NavLink to='login'>Log In</NavLink>}
                        {!user && <NavLink to='signup'>Sign Up</NavLink>}
                        {user && <button onClick={handleLogOut}>Log Out</button>}
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
