import React, {useEffect, useState} from 'react';
import cl from './Comment.module.css'
import {doc, getDoc} from "@firebase/firestore";
import {db} from "../../firebase-config";

const Comment = ({commentObj}) => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    const getUser = async (id) => {
        const userRef = doc(db, "/users", id)

        const userSnap = await getDoc(userRef)

        const email = userSnap._document.data.value.mapValue.fields.email.stringValue
        const password = userSnap._document.data.value.mapValue.fields.password.stringValue
        const username = userSnap._document.data.value.mapValue.fields.username.stringValue

        setUser({email: email, password: password, username: username})
    }

    useEffect(() => {
        setLoading(true)
        getUser(commentObj.userId).then(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className={cl.outer}>
            <p className={cl.user}>{user.username}</p>
            <p className={cl.comm}>{commentObj.value}</p>
        </div>
    );
};

export default Comment;