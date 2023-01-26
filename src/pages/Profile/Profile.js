import React, {useContext, useEffect, useRef, useState} from 'react';
import cl from './Profile.module.css'
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import {getUserById, updateUserData} from "../../http/requests";
import {AuthContext} from "../../App";

const Profile = () => {
    const [user, setUser] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const nameRef = useRef()
    const [isAuth, setIsAuth] = useContext(AuthContext)

    useEffect(() => {
        const newUser = JSON.parse(atob(localStorage.getItem('token')))
        console.log(newUser)
        setUser(newUser)
    }, [])

    const openEditName = () => {
        setIsOpen(true)
    }

    const validate = () => {
        return nameRef.current.value.length > 0;
    }

    const editName = async () => {
        if(validate()) {
            const newUser = JSON.parse(atob(localStorage.getItem('token')))
            updateUserData(newUser.id, {username: nameRef.current.value}).then()

            let newToken = ""

            await getUserById(newUser.id).then(data => {
                console.log(btoa(JSON.stringify(data)))
                newToken = btoa(JSON.stringify(data))
            })

            localStorage.setItem('token', newToken)
            window.location.reload()
        }
    }

    const editPostForm = (
        <div style={{padding: "0 20px"}}>
            <input
                ref={nameRef}
                className="public_input"
                placeholder="New username"
            />
            <button onClick={editName} style={{marginTop: 20}} className="public_button">
                Save
            </button>
        </div>
    )

    return (
        <div className={cl.outer}>
            <ModalWindow prtext={editPostForm} heading="Edit username" isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={cl.wrapper}>
                <h1>Profile</h1>
                <div className={cl.profileCard}>
                    <div className={cl.nameWrapper}>
                        <h2>{user.username}</h2>
                        <div>
                            <div className={cl.editName} onClick={openEditName}>
                                <img src="https://cdn-icons-png.flaticon.com/512/61/61456.png" width="40px" height="40px" alt="Delete"/>
                            </div>
                        </div>
                    </div>
                    <h2>{user.email}</h2>
                </div>
            </div>
        </div>
    );
};

export default Profile;