import React, {useContext, useEffect, useState} from 'react';
import cl from './Navigation.module.css'
import { useNavigate } from 'react-router-dom'
import {AuthContext} from "../../App";

const Navigation = () => {
    let navigate = useNavigate()

    const [isAuth] = useContext(AuthContext)
    const [active, setActive] = useState(0)
    const [user, setUser] = useState({})

    useEffect(() => {
        if(isAuth) {
            const newUser = JSON.parse(atob(localStorage.getItem('token')))
            setUser(newUser)
        } else {
            setUser({username: "Not authorized"})
        }
    }, [])

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

    const goTo = (path, index) => {
        setActive(index)
        navigate(path)
    }

    return (
        <div className={cl.outer}>
            <ul>
                {isAuth
                    ?
                        active === 1000
                            ?
                            <li className={cl.active} onClick={() => goTo("/profile", 1000)}>{user.username}</li>
                            :
                            <li onClick={() => goTo("/profile", 1000)}>{user.username}</li>
                    :
                        <div></div>
                }

                {liArr.map((el, index) =>
                    active === index
                    ?
                        <li key={index} className={cl.active} onClick={() => goTo(el.path, index)}>{el.name}</li>
                    :
                        <li key={index} onClick={() => goTo(el.path, index)}>{el.name}</li>
                )}
            </ul>
        </div>
    );
};

export default Navigation;