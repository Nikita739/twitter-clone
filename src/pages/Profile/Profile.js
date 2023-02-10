import React, {useContext, useEffect, useRef, useState} from 'react';
import cl from './Profile.module.css'
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import {getUserById, updateUserData} from "../../http/requests";

const Profile = () => {
    const searchParams = new URLSearchParams(window.location.search)
    let PARAMS_ID = searchParams.get("uid")

    if(localStorage.token) {
        if(JSON.parse(atob(localStorage.token)).id === PARAMS_ID) {
            PARAMS_ID = "my"
        }
    }

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const nameRef = useRef()
    const descriptionRef = useRef()

    useEffect(() => {
        setLoading(true)
        if(PARAMS_ID === "my") {
            const newUser = JSON.parse(atob(localStorage.getItem('token')))
            setUser(newUser)
            setLoading(false)
        } else {
            getUserById(PARAMS_ID).then(data => {
                setUser(data)
                setLoading(false)
            })
        }
    }, [])

    const openEditName = () => {
        setIsOpen(true)
    }

    const openEditDescription = () => {
        setIsDescriptionOpen(true)
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
                newToken = btoa(JSON.stringify(data))
            })

            localStorage.setItem('token', newToken)
        }
    }

    const editDescription = async () => {
        const newUser = JSON.parse(atob(localStorage.getItem('token')))
        updateUserData(newUser.id, {description: descriptionRef.current.value}).then()

        let newToken = ""

        await getUserById(newUser.id).then(data => {
            newToken = btoa(JSON.stringify(data))
        })

        localStorage.setItem('token', newToken)
        setIsDescriptionOpen(false)
    }

    let editNameForm = (
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

    let editDescriptionForm = (
        <div style={{padding: "0 20px"}}>
            <textarea
                ref={descriptionRef}
                className={["public_input", cl.textarea].join(" ")}
                placeholder="New description"
            />
            <button onClick={editDescription} style={{marginTop: 20}} className="public_button">
                Save
            </button>
        </div>
    )

    return (
        <div className={cl.outer}>
            <ModalWindow prtext={editNameForm} heading="Edit username" isOpen={isOpen} setIsOpen={setIsOpen} />
            <ModalWindow prtext={editDescriptionForm} heading="Edit description" isOpen={isDescriptionOpen} setIsOpen={setIsDescriptionOpen} />

            <div className={cl.wrapper}>
                <h1>Profile</h1>
                <div className={cl.profileCard}>
                    {loading
                        ?
                            <h1>Loading...</h1>
                        :
                            <>
                                <div className={cl.nameWrapper}>
                                    <h2>{user.username}</h2>
                                    <div>
                                        {PARAMS_ID === "my"
                                            &&
                                            <div className={cl.editName} onClick={openEditName}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/61/61456.png" width="40px" height="40px" alt="Delete"/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className={cl.nameWrapper}>
                                    <h2 className={cl.description}>{user.description ? user.description : "No description provided"}</h2>
                                    <div>
                                        {PARAMS_ID === "my"
                                            &&
                                            <div className={cl.editName} onClick={openEditDescription}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/61/61456.png" width="40px" height="40px" alt="Delete"/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <h2>{user.email}</h2>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;