import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../App";

const Logout = () => {
    const navigate = useNavigate()
    const [isAuth, setIsAuth] = useContext(AuthContext)

    useEffect(() => {
        localStorage.setItem('token', '')
        setIsAuth(false)
        navigate("/")
        window.location.reload()
    }, [])

    return (
        <div>

        </div>
    );
};

export default Logout;