import { PostsState, PostFormData, PostDeleteData} from "./postSlice";

const API_URL = "https://mq-sspr.onrender.com";
const token = localStorage.getItem("token");

export async function fetchPosts(index:string) {
    return fetch(`${API_URL}/communities/${index}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as PostsState;
    })
}

export async function createPosts(payload: PostFormData) {
    const post = payload.post;
    return fetch(`${API_URL}/posts.json`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            post
        })
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as PostsState;
    })
}

export async function destroyPost(payload: PostDeleteData) {
    const post = payload.post;
    return fetch(`${API_URL}/posts/${post.id}.json`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        }).then((response) => response.json())
        .catch((error) => {
            console.log("Error:", error);
            return {} as PostsState;
    }
    )
}

export async function updatePost(payload: PostFormData) {
    const post = payload.post
    return fetch(`${API_URL}/posts/${post.id}.json`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            post, 
        }),
    }).then((response) => response.json())
    .catch((e) => {
        console.log("Error:", e);
        return {} as PostsState;
    })
}