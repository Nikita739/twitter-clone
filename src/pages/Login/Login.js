import React, {useContext, useState} from 'react';
import cl from './Login.module.css'
import {addDoc, collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../firebase-config";
import {AuthContext} from "../../App";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const usersCollection = collection(db, "/users")
    const [isAuth, setIsAuth] = useContext(AuthContext)

    const validate = () => {
        let result = true

        if(email.length < 2 || password.length === 0) {
            return false
        }

        return result
    }

    const login = async () => {
        if(validate()) {
            let loginQuery = query(usersCollection, where("email", "==", email), where("password", "==", password))
            const querySnapshot = await getDocs(loginQuery)
            let loginObj = {}
            querySnapshot.forEach((doc) => {
                loginObj.id = doc.id
                loginObj.username = doc.data().username
                loginObj.email = doc.data().email
                loginObj.password = doc.data().password
                loginObj.likes = doc.data().likes
                loginObj.description = doc.data().description
            });
            console.log(loginObj)
            if(Object.keys(loginObj).length !== 0) {
                const encodedStr = btoa(JSON.stringify(loginObj))
                localStorage.setItem('token', encodedStr)
                setIsAuth(true)
                navigate("/")
                window.location.reload()
            } else {
                alert("Неверный email или пароль")
            }
            setEmail("")
            setPassword("")
        }
    }

    return (
        <div className={cl.outer}>
            <h1>Authorization</h1>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
            />
            <button onClick={login}>Login</button>
        </div>
    );
};

export default Login;