import React, {useEffect, useState} from 'react';
import cl from './Comment.module.css'
import {doc, getDoc} from "@firebase/firestore";
import {db} from "../../firebase-config";
import {getUserById} from "../../http/requests";
import Loader from "../Loader/Loader";
import ProfilePreview from "../ProfilePreview/ProfilePreview";

const Comment = ({commentObj}) => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    const getUser = async (id) => {
        const res = await getUserById(id)
        setUser(res)
    }

    useEffect(() => {
        setLoading(true)
        getUser(commentObj.userId).then(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className={cl.outer}>
            {loading
                ?
                    <Loader />
                :
                    <>
                        <ProfilePreview uid={commentObj.userId} />
                        <p className={cl.comm}>{commentObj.value}</p>
                    </>
            }
        </div>
    );
};

export default Comment;