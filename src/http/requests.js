import {collection, doc, getDoc, getDocs, query, updateDoc, where} from "@firebase/firestore";
import {db} from "../firebase-config";

const postsCollectionRef = collection(db, "/posts")

export const getUserById = async (id) => {
    const userRef = doc(db, "/users", id)
    const userSnap = await getDoc(userRef)

    const uid = userSnap.id
    const email = userSnap._document.data.value.mapValue.fields.email.stringValue
    const password = userSnap._document.data.value.mapValue.fields.password.stringValue
    const username = userSnap._document.data.value.mapValue.fields.username.stringValue

    return {id: uid, email: email, password: password, username: username}
}

export const getPostById = async (id) => {
    const postRef = doc(db, "/posts", id)
    const postSnap = await getDoc(postRef)

    const pid = postSnap.id
    const comments = postSnap.data().comments
    const description = postSnap._document.data.value.mapValue.fields.description.stringValue
    const title = postSnap._document.data.value.mapValue.fields.title.stringValue
    const uid = postSnap._document.data.value.mapValue.fields.userId.stringValue

    return {id: pid, comments: comments, description: description, title: title, userId: uid}
}

export const getPosts = async () => {
    const data = await getDocs(postsCollectionRef)
    return data
}

export const getPostByQuery = async (queryStr) => {
    let postsQuery = query(postsCollectionRef, where("title", "in", [queryStr]))
    const querySnapshot = await getDocs(postsQuery)
    return querySnapshot
}

export const updatePostData = async (postId, updateData) => {
    if(updateData) {
        await updateDoc(doc(db, "/posts", postId), updateData)
    }
}

export const updateUserData = async (postId, updateData) => {
    if(updateData) {
        await updateDoc(doc(db, "/users", postId), updateData)
    }
}