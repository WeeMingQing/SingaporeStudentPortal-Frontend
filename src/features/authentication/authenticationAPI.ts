import { AuthenticationsState, AuthenticationFormData, AuthenticationDeleteData} from "./authenticationSlice";

const API_URL = "https://mq-sspr.onrender.com";

export async function fetchUsers() {
    return fetch(`${API_URL}/users.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as AuthenticationsState;
    })
}

export async function createUsers(payload: AuthenticationFormData) {
    const user = payload.user;
    return fetch(`${API_URL}/users.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user
        })
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as AuthenticationsState;
    })
}

export async function destroyUser(payload: AuthenticationDeleteData) {
    const user = payload.user;
    return fetch(`${API_URL}/users/${user.id}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user,
        }),
        }).then((response) => response.json())
        .catch((error) => {
            console.log("Error:", error);
            return {} as AuthenticationsState;
    }
    )
}

export async function updateUser(payload: AuthenticationFormData) {
    const user = payload.user
    return fetch(`${API_URL}/users/${user.id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user, 
        }),
    }).then((response) => response.json())
    .catch((e) => {
        console.log("Error:", e);
        return {} as AuthenticationsState;
    })
}