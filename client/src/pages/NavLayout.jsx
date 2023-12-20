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


    let navbar = <div className="navbar bg-[#111111]">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#111111] rounded-box w-52">
                    <NavLink to='/' ><li><a>Home</a></li></NavLink>
                    {user && <NavLink to='sessionsbrowser'><li><a>Your Sessions</a></li></NavLink>}
                </ul>
            </div>
        </div>
        <div className="navbar-center">
            <NavLink to='/' ><a className="btn btn-ghost text-2xl text-white">LIVE CODE</a></NavLink>
        </div>
        <div className="navbar-end">
            <div className="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img alt="User Profile Image" src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />
                    </div>
                </div>
                <ul tabindex="0" className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#111111] rounded-box w-52">
                    {!user && <NavLink to='login'><li><a className="justify-between">Log In</a></li></NavLink>}
                    {!user && <NavLink to='signup'><li><a>Sign Up</a></li></NavLink>}
                    {user && <NavLink to='account'><li><a>{user._username.toUpperCase()}</a></li></NavLink>}
                    {user && <li><a onClick={handleLogOut}>Logout</a></li>}
                </ul>
            </div>
        </div>
    </div>


    return (
        <div className='w-screen object-top sticky'>
            <header>
                {navbar}
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
