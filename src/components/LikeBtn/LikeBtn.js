import React, {useEffect, useState} from 'react';
import cl from './LikeBtn.module.css'
import {doc, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "../../firebase-config";
import {updateUserData} from "../../http/requests";
import ModalWindow from "../ModalWindow/ModalWindow";

const LikeBtn = ({isModalOpen, setIsModalOpen, isActive, isLiked, realLikes, setRealLikes, commentUserRef, postObj, uid}) => {
    const dislike = async (e) => {
        e.stopPropagation()
        await updateDoc(doc(db, "/posts", postObj.id), {
            likesCount: realLikes - 1
        })

        let newLikes = []
        const userSnap = await getDoc(commentUserRef)

        newLikes = [...userSnap.data().likes]
        const index = newLikes.indexOf(postObj.id)
        newLikes.splice(index, 1)

        updateUserData(uid, {likes: newLikes}).then()

        setRealLikes(realLikes - 1)
    }

    const like = async (e) => {
        e.stopPropagation()
        await updateDoc(doc(db, "/posts", postObj.id), {
            likesCount: realLikes + 1
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

    const openModal = (e) => {
        e.stopPropagation()
        setIsModalOpen(true)
    }

    return (
        <>
            <div className={cl.likeWrapper}>
                {isActive
                    ?
                    isLiked
                        ?
                        <button onClick={(e) => dislike(e)}></button>
                        :
                        <button className={cl.disliked} onClick={(e) => like(e)}></button>
                    :
                    <button className={cl.disliked} onClick={(e) => openModal(e)}></button>
                }

                <p>{realLikes}</p>
            </div>
        </>

    );
};

export default LikeBtn;