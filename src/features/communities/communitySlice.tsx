import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {RootState} from "../../app/store";
import { fetchCommunities, createCommunity, destroyCommunity, updateCommunity } from "./communityAPI";


export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...", 
    UpToDate =  "Up To Date", 
    Deleted = "Deleted",
    Error = "Error"
}

export interface CommunityFormData {
    community: {
        id?: number;
        header: string
    }
}

export interface CommunityUpdateData {
    community: {
        community_id: number;
        community: CommunityState;
    }
}

export interface CommunityDeleteData {
    community: {
        id: number

    }
}

export interface CommunityState {
    id?: number;
    user_id: number,
    username: string,
    header: string;
    created_at?: any;
    updated_at?: any;
}

export interface CommunitiesState {
    communities: CommunityState[];
    status: string;

}

export const fetchCommunitiesAsync = createAsyncThunk(
    "communities/fetchCommunities",
    async (index:string) => {
        const response = await fetchCommunities(index);
        return response;
    }
)


const initialState: CommunitiesState = {
    communities: [
        {
            id: 0,
            user_id: 0,
            username: "",
            header: "",
            "created_at": "",
            "updated_at": "",
        }
    ], 
    status: Statuses.Initial
}

export const createCommunityAsync = createAsyncThunk(
    "community/createCommunity",
    async (payload: CommunityFormData)=> {
        const response = await createCommunity(payload);
        return response;
    }
)

export const destroyCommunityAsync = createAsyncThunk(
    'communities/deleteCommunity',
    async (payload: CommunityDeleteData) => {
        const response = await destroyCommunity(payload);
        return response;
    }
)

export const updateCommunityAsync = createAsyncThunk(
    'communities/updateCommunity',
    async(payload: CommunityFormData) => {
        const response = await updateCommunity(payload);
        return response;
    }
)

export const communitiesSlice = createSlice({
    name: "communities",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /** To provide cases for GET scenario */
            .addCase(fetchCommunitiesAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchCommunitiesAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.communities = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(fetchCommunitiesAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for POST scenario */

            .addCase(createCommunityAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            
            .addCase(createCommunityAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for DELETE scenario */

            .addCase(destroyCommunityAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(destroyCommunityAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.communities = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(destroyCommunityAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for PUT scenario */

            .addCase(updateCommunityAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(updateCommunityAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.communities.findIndex(community => community.id === action.payload.id);
                    draftState.communities[index] = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(updateCommunityAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = communitiesSlice.actions;

export const selectCommunities = (state: RootState) => state.communities.communities;

export const selectStatus = (state: RootState) => state.communities.status;

export default communitiesSlice.reducer;