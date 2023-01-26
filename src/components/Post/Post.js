import React, {useContext, useEffect, useRef, useState} from 'react';
import cl from './Post.module.css'
import {deleteDoc, doc, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "../../firebase-config";
import {useNavigate} from 'react-router-dom'
import {AuthContext} from "../../App";
import ModalWindow from "../ModalWindow/ModalWindow";
import {getUserById, updatePostData, updateUserData} from "../../http/requests";

const Post = ({postObj}) => {
    const [user, setUser] = useState({})
    const [realLikes, setRealLikes] = useState(0)
    const [isAuth] = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState({id: ""})
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)

    let uid = ""
    let commentUserRef = false
    if(localStorage.getItem('token') !== "") {
        uid = JSON.parse(atob(localStorage.getItem('token'))).id
        commentUserRef = doc(db, "/users", uid)
    }

    const [commUserSnap, setCommUserSnap] = useState([])
    const [isLiked, setIsLiked] = useState(false)

    const like = async (e) => {
        e.stopPropagation()
        const currentLikes = realLikes
        await updateDoc(doc(db, "/posts", postObj.id), {
            likesCount: currentLikes + 1
        })

        let newLikes = []

        if(commentUserRef) {
            const userSnap = await getDoc(commentUserRef)

            newLikes = [...userSnap.data().likes]
            if(!newLikes.includes(postObj.id)) {
                newLikes.push(postObj.id)
            }

            updateUserData(uid, {likes: newLikes}).then()
        }

        setRealLikes(realLikes + 1)
    }

    const dislike = async (e) => {
        e.stopPropagation()
        const currentLikes = realLikes
        await updateDoc(doc(db, "/posts", postObj.id), {
            likesCount: currentLikes - 1
        })

        let newLikes = []
        const userSnap = await getDoc(commentUserRef)

        newLikes = [...userSnap.data().likes]
        const index = newLikes.indexOf(postObj.id)
        newLikes.splice(index, 1)

        updateUserData(uid, {likes: newLikes}).then()

        setRealLikes(realLikes - 1)
    }

    const openModal = (e) => {
        e.stopPropagation()
        setIsModalOpen(true)
    }

    useEffect(() => {
        const test = async () => {
            if(commentUserRef) {
                const userSnap = await getDoc(commentUserRef)
                setCommUserSnap(userSnap.data().likes)
                if(userSnap.data().likes.includes(postObj.id)) {
                    setIsLiked(true)
                } else {
                    setIsLiked(false)
                }
            }
        }

        test()
    }, [realLikes])

    // On load ONLY //
    useEffect(() => {
        if(localStorage.getItem('token')) {
            const currUser = JSON.parse(atob(localStorage.getItem("token")))
            setCurrentUser(currUser)
        }

        getUserById(postObj.userId).then((data) => {
            setUser(data)
        })
        setRealLikes(postObj.likesCount)
    }, [])

    const deletePost = (e) => {
        e.stopPropagation()
        const postRef = doc(db, "/posts", postObj.id)
        deleteDoc(postRef).then(() => {
            console.log("Deleted successfully")
        })
    }

    const openEditPost = (e) => {
        e.stopPropagation()
        setIsEditOpen(true)
    }

    const validate = () => {
        return !(titleRef.current.value.length === 0 || descriptionRef.current.value.length === 0);
    }

    const editPost = async () => {
        if(validate()) {
            // Update post //
            const title = titleRef.current.value
            const description = descriptionRef.current.value
            await updateDoc(doc(db, "/posts", postObj.id), {
                title: title,
                description: description
            })
            setIsEditOpen(false)
            window.location.reload()
            console.log("Updated")
        }
    }

    const editPostForm = (
        <div style={{padding: "0 20px"}}>
            <input
                ref={titleRef}
                className="public_input"
                placeholder="Title"
            />
            <textarea
                ref={descriptionRef}
                className="public_textarea"
                rows="15"
                cols="50"
                placeholder="Description"
            />
            <button onClick={(e) => editPost(e)} style={{marginTop: 20}} className="public_button">
                Save
            </button>
        </div>
    )

    return (
        <>
            <ModalWindow isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            <ModalWindow prtext={editPostForm} heading="Edit post" isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
            <div className={cl.outer} onClick={() => navigate(`/post/${postObj.id}`)}>
                <div className={cl.topBar}>
                    <p className={cl.user}>{user.username}</p>
                    {postObj.userId === currentUser.id
                    &&
                    <div>
                        <div onClick={(e) => deletePost(e)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" width="40px" height="40px" alt="Delete"/>
                        </div>
                        <div onClick={(e) => openEditPost(e)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/61/61456.png" width="40px" height="40px" alt="Delete"/>
                        </div>
                    </div>
                    }
                </div>

                <h2>{postObj.title}</h2>
                <p>{postObj.description}</p>
                <div className={cl.likes}>
                    {isAuth
                        ?
                        isLiked
                            ?
                            <button onClick={(e) => dislike(e)}>

                            </button>
                            :
                            <button className={cl.disliked} onClick={(e) => like(e)}>

                            </button>
                        :
                        <>
                            <button className={cl.disliked} onClick={(e) => openModal(e)}>

                            </button>
                        </>
                    }
                    <p>{realLikes}</p>
                </div>
            </div>
        </>
    )
};

export default Post;