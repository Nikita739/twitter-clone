import React, {useContext, useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import {doc, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "../../firebase-config";
import cl from './PostPage.module.css'
import Comment from "../../components/Comment/Comment";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import {AuthContext} from "../../App";
import Post from "../../components/Post/Post";
import Loader from "../../components/Loader/Loader";

const PostPage = () => {
    const {id} = useParams()
    const [post, setPost] = useState({})
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState("")
    const [fake, setFake] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAuth, setIsAuth] = useContext(AuthContext)

    const validate = () => {
        setComment(comment.trim())
        if(comment.trim().length > 0) {
            return true
        }
        alert("Comment body can't be empty")
        return false
    }

    const getUser = async (id) => {
        const userRef = doc(db, "/users", id)

        const userSnap = await getDoc(userRef)

        const email = userSnap._document.data.value.mapValue.fields.email.stringValue
        const password = userSnap._document.data.value.mapValue.fields.password.stringValue
        const username = userSnap._document.data.value.mapValue.fields.username.stringValue

        setUser({email: email, password: password, username: username})
    }

    const postComment = async () => {
        if(isAuth) {
            if(validate()) {
                let newComments = []

                const postRef = doc(db, "/posts", post.id);
                const postSnap = await getDoc(postRef);
                console.log(postSnap.data().comments)

                newComments = postSnap.data().comments

                let uid = JSON.parse(atob(localStorage.getItem('token'))).id
                console.log(uid)

                newComments.push({value: comment, userId: uid})

                console.log(newComments)

                await updateDoc(doc(db, "/posts", post.id), {
                    comments: newComments
                });
                setFake(!fake)
            }
        } else {
            setIsModalOpen(true)
            setComment("")
        }
    }

    useEffect(() => {
        const postRef = doc(db, "/posts", id)
        setLoading(true)

        const setNewPost = async () => {
            const postSnap = await getDoc(postRef)
            setPost({...postSnap.data(), id: postSnap.id})
            console.log({...postSnap.data(), id: postSnap.id})
            await getUser(postSnap.data().userId)

            return {...postSnap.data(), id: postSnap.id}
        }
        setNewPost().then(data => {
            setLoading(false)
        })
    }, [fake])

    return (
        <div className={cl.wrapper}>
            <ModalWindow isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            {loading
                ?
                <Loader />
                :
                <div className={cl.outer}>
                    {Object.keys(post).length > 0
                        ?
                        <Post postObj={post} />
                        :
                        <h1>Test</h1>
                    }
                    <h2>Comments</h2>
                    <div className={cl.commentWrapper}>
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button onClick={postComment} className="public_button">Post</button>
                    </div>
                    <div className={cl.comments}>
                        {post.comments.map((el, index) =>
                            <Comment key={index} commentObj={el} />
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default PostPage;