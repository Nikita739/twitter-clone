import React, {useContext, useEffect, useRef, useState} from 'react';
import cl from './Profile.module.css'
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import {getPosts, getPostsByUserId, getUserById, updateUserData} from "../../http/requests";
import Loader from "../../components/Loader/Loader";
import Post from "../../components/Post/Post";
import Pagination from "../../components/Pagination/Pagination";

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
    const [isPostsLoading, setIsPostsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [postsRef, setPostsRef] = useState(null)
    const [postsCount, setPostsCount] = useState(0)
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const nameRef = useRef()
    const descriptionRef = useRef()

    useEffect(() => {
        setLoading(true)

        const newUser = JSON.parse(atob(localStorage.getItem('token')))
        const id = PARAMS_ID === "my" ? newUser.id : PARAMS_ID

        if(PARAMS_ID === "my") {
            setUser(newUser)
            setLoading(false)
        } else {
            getUserById(PARAMS_ID).then(data => {
                setUser(data)
                setLoading(false)
            })
        }

        setIsPostsLoading(true)
        fetchInitialPosts(id).then()
    }, [])

    const fetchInitialPosts = async (id) => {
        const data = await getPostsByUserId(id)

        const postsData = data[0]
        const docs = postsData.docs

        setPostsCount(Math.ceil(data[1] / 3))

        setPostsRef(postsData)
        setPosts(docs.map((doc) => ({...doc.data(), id: doc.id})))
        setIsPostsLoading(false)
    }

    const loadMore = async () => {
        const newUser = JSON.parse(atob(localStorage.getItem('token')))
        const id = PARAMS_ID === "my" ? newUser.id : PARAMS_ID

        if(postsRef) {
            setIsPostsLoading(true)

            const response = await getPostsByUserId(id, postsRef)
            const data = response[0]

            const newPosts = data.docs.map((doc) => ({...doc.data(), id: doc.id}))

            setPosts([...posts, ...newPosts])
            setPostsRef(data)
            console.log(data.docs)

            setIsPostsLoading(false)
        }
    }

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
                <h2>{user.username} Posts</h2>
                <div className={cl.postsWrapper}>
                    {posts.map(el =>
                        <Post key={el.id} postObj={el}/>
                    )}
                </div>
                {isPostsLoading
                    &&
                        <Loader />
                }
                <Pagination
                    max={postsCount}
                    loadMore={loadMore}
                    setPage={setPage}
                    page={page}
                />
            </div>
        </div>
    );
};

export default Profile;