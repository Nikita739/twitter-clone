import React, {useState} from 'react';
import cl from './Registration.module.css'
import {addDoc, collection} from "@firebase/firestore";
import {db} from "../../firebase-config";

const Registration = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const usersCollection = collection(db, "/users")

    const register = async () => {
        await addDoc(usersCollection, {email: email, password: password, username: username, likes: [], description: ""})
        setEmail("")
        setPassword("")
        setUsername("")
    }

    return (
        <div className={cl.outer}>
            <h1>Registration</h1>
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
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                type="text"
            />
            <button onClick={register}>Register</button>
        </div>
    );
};

export default Registration;