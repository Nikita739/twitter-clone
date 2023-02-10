import React, {useEffect, useState} from 'react';
import {getUserById} from "../../http/requests";
import cl from './ProfilePreview.module.css'
import {useNavigate} from "react-router-dom";

const ProfilePreview = ({uid}) => {
    const [userObj, setUserObj] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        getUserById(uid).then(data => {
            setUserObj(data)
            setIsLoading(false)
        })
    }, [])

    const goToProfile = (e) => {
        e.stopPropagation()
        navigate(`/profile?uid=${uid}`)
    }

    return (
        <div onClick={goToProfile} className={cl.outer}>
            <p>{isLoading ? "Loading..." : userObj.username}</p>
        </div>
    );
};

export default ProfilePreview;