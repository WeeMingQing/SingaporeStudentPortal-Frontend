import { CommentState, CommentsState, CommentFormData, CommentDeleteData} from "./commentSlice";

const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

type fetchCommentsProps = {
    getComments: (arr: CommentState[]) => void;
    PostIndex: number
}
export async function fetchPostComments({getComments, PostIndex}: fetchCommentsProps) {
    return fetch(`${API_URL}/posts/${PostIndex}`, {
        method: "GET",
        headers: {  
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .then((data) => {
        getComments(data);
    })
    .catch((error) => {
        console.log("Error: ", error);
    })
}




export async function fetchComments(index: string) {
    return fetch(`${API_URL}/posts/${index}`, {
        method: "GET",
        headers: {  
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
    })
}

export async function createComment(payload: CommentFormData) {
    const comment = payload.comment;
    return fetch(`${API_URL}/comments.json`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment
        })
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as CommentsState;
    })
}

export async function destroyComment(payload: CommentDeleteData) {
    const comment = payload.comment;
    return fetch(`${API_URL}/comments/${comment.id}.json`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        }).then((response) => response.json())
        .catch((error) => {
            console.log("Error:", error);
    }
    )
}

export async function updateComment(payload: CommentFormData) {
    const comment = payload.comment
    return fetch(`${API_URL}/comments/${comment.id}.json`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment
        }),
    }).then((response) => response.json())
    .catch((e) => {
        console.log("Error:", e);
        return {} as CommentsState;
    })
}