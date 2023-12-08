import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function NavLayout() {

    return (
        <div>
            <header>
                <h1>Live Coding Class</h1>
                <nav>
                    <NavLink to='/' >Home</NavLink>
                        <NavLink to='chatbrowser'>Chat Browser</NavLink>
                        <NavLink to='signup'>Sign Up</NavLink>
                        <NavLink to='login'>Log In</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
