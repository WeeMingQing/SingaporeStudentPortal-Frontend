import { CommunitiesState, CommunityFormData, CommunityDeleteData} from "./communitySlice";
import { CommunityState } from "./communitySlice";
const API_URL = "https://mq-sspr.onrender.com";
const token = localStorage.getItem("token");

type fetchUserCountProps = {
    community_header: string,
    updateUserCount: (userNumber: number) => void
}

export async function fetchUserCount({community_header, updateUserCount}: fetchUserCountProps) {
    return fetch(`${API_URL}/communities_all`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .then(data => {
        let d:CommunityState[] = data;
        var count:number = 0;
        d?.forEach(community => {
            if (community.header == community_header && community.user_id != 1) {
                count += 1;
            }
        })
        updateUserCount(count);

    })
}

export async function fetchCommunities(index:string) {
    return fetch(`${API_URL}/communities/${index}`, {
        method: "GET",
        headers: {

            "Content-Type": "application/json"
        },
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as CommunitiesState;
    })
}

export async function createCommunity(payload: CommunityFormData) {
    const community = payload.community;
    return fetch(`${API_URL}/communities.json`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            community
        })
    }).then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as CommunitiesState;
    })
}

export async function destroyCommunity(payload: CommunityDeleteData) {
    const community = payload.community;
    return fetch(`${API_URL}/communities/${community.id}.json`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        }).then((response) => response.json())
        .catch((error) => {
            console.log("Error:", error);
            return {} as CommunitiesState;
    }
    )
}

export async function updateCommunity(payload: CommunityFormData) {
    const community = payload.community
    return fetch(`${API_URL}/communities/${community.id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            community, 
        }),
    }).then((response) => response.json())
    .catch((e) => {
        console.log("Error:", e);
        return {} as CommunitiesState;
    })
}