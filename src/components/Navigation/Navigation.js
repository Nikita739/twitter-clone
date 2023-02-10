import React, {useContext, useEffect, useState} from 'react';
import cl from './Navigation.module.css'
import { useNavigate } from 'react-router-dom'
import {AuthContext} from "../../App";

const Navigation = () => {
    const [isAuth] = useContext(AuthContext)
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const path = window.location.pathname

    let liArr = []
    if(isAuth) {
        liArr = [
            {name: "Home", path: "/"},
            {name: "Add post", path: "/new"},
            {name: "Logout", path: "/logout"}
        ]
    } else {
        liArr = [
            {name: "Home", path: "/"},
            {name: "Register", path: "/register"},
            {name: "Login", path: "/login"}
        ]
    }

    useEffect(() => {
        if(isAuth) {
            const newUser = JSON.parse(atob(localStorage.getItem('token')))
            setUser(newUser)
        }
    }, [])

    return (
        <div className={cl.outer}>
            <ul>
                {isAuth
                    ?
                        path === "/profile"
                            ?
                                <li className={cl.active} onClick={() => navigate("/profile?uid=my")}>{user.username}</li>
                            :
                                <li onClick={() => navigate("/profile?uid=my")}>{user.username}</li>
                    :
                        null
                }

                {liArr.map((el, index) =>
                    path === el.path
                    ?
                        <li key={index} className={cl.active} onClick={() => navigate(el.path)}>{el.name}</li>
                    :
                        <li key={index} onClick={() => navigate(el.path)}>{el.name}</li>
                )}
            </ul>
        </div>
    );
};

export default Navigation;