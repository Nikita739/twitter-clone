import React, {useEffect, useState} from 'react';
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../firebase-config";
import cl from './Main.module.css'
import Post from "../../components/Post/Post";
import Pagination from "../../components/Pagination/Pagination";
import {getPostByQuery, getPosts} from "../../http/requests";
import Loader from "../../components/Loader/Loader";

const Main = () => {
    const [posts, setPosts] = useState([])
    const [postsRef, setPostsRef] = useState(null)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [postsCount, setPostsCount] = useState(0)

    const fetchSearchedPosts = async () => {
        setIsLoading(true)
        getPostByQuery(search).then(data => {
            setPosts(data.docs.map(doc => ({...doc.data(), id: doc.id})))
            setIsLoading(false)
        })
    }

    useEffect(() => {
        if(search === "") {
            fetchInitialPosts().then()
        } else {
            fetchSearchedPosts().then()
        }
    }, [search])

    const fetchInitialPosts = async () => {
        setIsLoading(true)

        const response = await getPosts(postsRef)
        const data = response[0]

        console.log(response[1])
        setPostsCount(Math.ceil(response[1] / 3))

        const dataDocs = data.docs
        setPostsRef(data)
        setPosts(dataDocs.map((doc) => ({...doc.data(), id: doc.id})))

        setIsLoading(false)
    }

    const loadMore = async () => {
        if(postsRef) {
            setIsLoading(true)

            const response = await getPosts(postsRef)
            const data = response[0]

            const newPosts = data.docs.map((doc) => ({...doc.data(), id: doc.id}))

            setPosts([...posts, ...newPosts])
            setPostsRef(data)
            console.log(data.docs)

            setIsLoading(false)
        }
    }

    return (
        <div className={cl.wrapper}>
            <div className={cl.searchWrapper}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search"
                />
            </div>
            <div className={cl.outer}>
                {posts.length > 0
                    ?
                    posts.map(el =>
                        <div className={cl.postsWrapper} key={el.id}>
                            <Post postObj={el} />
                        </div>
                    )
                    :
                    <h1 className={cl.notFound}>Nothing was found...</h1>
                }
                {isLoading
                    &&
                        <Loader />
                }

            </div>
            <div className={cl.pagination}>
                <Pagination loadMore={loadMore} max={postsCount} page={page} setPage={setPage} />
            </div>
        </div>
    );
};

export default Main;