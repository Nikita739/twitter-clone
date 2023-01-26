import React, {useState} from 'react';
import cl from './New.module.css'
import {addDoc, collection} from "@firebase/firestore";
import {db} from "../../firebase-config";
import {useNavigate} from "react-router-dom";

const New = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    const postsCollection = collection(db, "/posts")

    const validate = () => {
        let result = true

        if(title.length < 2 || description.length < 2) {
            result = false
        }

        return result
    }

    const createPost = async () => {
        if(validate()) {
            let userObj = JSON.parse(atob(localStorage.getItem('token')))
            console.log(userObj)
            await addDoc(postsCollection, {title: title, description: description, userId: userObj.id, comments: [], likesCount: 0})
            setTitle("")
            setDescription("")
            navigate("/")
        }
    }

    return (
        <div className={cl.outer}>
            <h1>Add new post</h1>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                type="text"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="15"
                cols="50"
                placeholder="Description"
            />
            <button onClick={createPost}>Post</button>
        </div>
    );
};

export default New;