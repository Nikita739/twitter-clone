import React, {useEffect, useState} from 'react';
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../firebase-config";
import cl from './Main.module.css'
import Post from "../../components/Post/Post";
import Pagination from "../../components/Pagination/Pagination";
import {getPostByQuery, getPosts} from "../../http/requests";

const Main = () => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [postsCount, setPostsCount] = useState(0)

    const fetchSearchedPosts = async () => {
        getPostByQuery(search).then(data => {
            setPosts(data.docs.map(doc => ({...doc.data(), id: doc.id})))
        })
    }

    useEffect(() => {
        if(search === "") {
            const getAllPosts = async () => {
                const data = await getPosts()
                const offset = (page - 1) * 10
                const dataDocs = data.docs.slice(offset, 10 + offset)
                setPosts(dataDocs.map((doc) => ({...doc.data(), id: doc.id})))
                setPostsCount(Math.ceil(data.docs.length / 10))
            }
            getAllPosts().then(r => {

            })
        } else {
            fetchSearchedPosts().then()
        }
    }, [search, page])

    return (
        <div className={cl.wrapper}>
            <div className={cl.searchWrapper}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search"
                />
                <h2>Page {page}</h2>
            </div>
            <div className={cl.outer}>
                {posts.length > 0
                    ?
                        posts.map(el =>
                            <Post key={el.id} postObj={el} />
                        )
                    :
                        <h1 className={cl.notFound}>Nothing was found...</h1>
                }
            </div>
            <div className={cl.pagination}>
                <Pagination setPage={setPage} page={page} max={postsCount} />
            </div>
        </div>
    );
};

export default Main;