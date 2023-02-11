import {
    collection, collectionGroup,
    doc, getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where
} from "@firebase/firestore";
import {db} from "../firebase-config";

const postsCollectionRef = collection(db, "/posts")

export const getUserById = async (id) => {
    const userRef = doc(db, "/users", id)
    const userSnap = await getDoc(userRef)

    const uid = userSnap.id
    const email = userSnap._document.data.value.mapValue.fields.email.stringValue
    const password = userSnap._document.data.value.mapValue.fields.password.stringValue
    const username = userSnap._document.data.value.mapValue.fields.username.stringValue
    const description = userSnap._document.data.value.mapValue.fields.description.stringValue

    return {id: uid, email: email, password: password, username: username, description: description}
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

export const getPosts = async (prevData) => {
    if(prevData) {
        const lastVisible = prevData.docs[prevData.docs.length-1];

        const next = query(collection(db, "/posts"),
            orderBy("title"),
            startAfter(lastVisible),
            limit(3));

        const totalGroup = collectionGroup(db, "posts")
        const totalSnapshot = await getCountFromServer(totalGroup)
        const totalPostsCount = totalSnapshot.data().count

        const res = await getDocs(next)
        return [res, totalPostsCount]
    } else {
        const first = query(collection(db, "/posts"), orderBy("title"), limit(3))
        const documentSnapshots = await getDocs(first)

        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1]

        const totalGroup = collectionGroup(db, "posts")
        const totalSnapshot = await getCountFromServer(totalGroup)
        const totalPostsCount = totalSnapshot.data().count

        const res = await getDocs(first)
        return [res, totalPostsCount]
    }
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

export const getPostsByUserId = async (uid, prevData) => {
    if(prevData) {
        const lastVisible = prevData.docs[prevData.docs.length-1];

        const next = query(collection(db, "/posts"),
            where("userId", "==", uid),
            orderBy("title"),
            startAfter(lastVisible),
            limit(3));

        const totalGroup = collectionGroup(db, "posts")
        const totalSnapshot = await getCountFromServer(totalGroup)
        const totalPostsCount = totalSnapshot.data().count

        const res = await getDocs(next)
        return [res, totalPostsCount]
    } else {
        const first = query(collection(db, "/posts"), where("userId", "==", uid), orderBy("title"), limit(3))
        const documentSnapshots = await getDocs(first)

        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1]

        const totalGroup = collectionGroup(db, "posts")
        const totalSnapshot = await getCountFromServer(totalGroup)
        const totalPostsCount = totalSnapshot.data().count

        const res = await getDocs(first)
        return [res, totalPostsCount]
    }
}