import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {RootState} from "../../app/store";
import { fetchPosts, createPosts, destroyPost, updatePost } from "./postAPI";


export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...", 
    UpToDate =  "Up To Date", 
    Deleted = "Deleted",
    Error = "Error"
}

export interface PostFormData {
    post: {
        id?: number;
        user_id: number;
        username: string;
        content: string;
        community_id: number;
        community_header: string;
    }
}

export interface PostUpdateData {
    post: {
        post_id: number;
        post: PostState;
    }
}

export interface PostDeleteData {
    post: {
        id: number, 

    }
}

export interface PostState {
    id?: number;
    user_id: number;
    username: string;
    community_id: number;
    community_header: string;
    content: string;
    created_at?: any;
    updated_at?: any;
}

export interface PostsState {
    posts: PostState[];
    status: string;

}

export const fetchPostsAsync = createAsyncThunk(
    "posts/fetchPosts",
    async (index:string) => {
        const response = await fetchPosts(index);
        return response;
    }
)


const initialState: PostsState = {
    posts: [
        {
            id: 0,
            user_id:0,
            content:"",
            username:"",
            community_id:0,
            community_header:"",
            "created_at": "",
            "updated_at": "",
        }
    ], 
    status: Statuses.Initial
}

export const createPostsAsync = createAsyncThunk(
    "post/createPosts",
    async (payload: PostFormData)=> {
        const response = await createPosts(payload);
        return response;
    }
)

export const destroyPostAsync = createAsyncThunk(
    'posts/deletePost',
    async (payload: PostDeleteData) => {
        const response = await destroyPost(payload);
        return response;
    }
)

export const updatePostAsync = createAsyncThunk(
    'posts/updatePost',
    async(payload: PostFormData) => {
        const response = await updatePost(payload);
        return response;
    }
)

export const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /** To provide cases for GET scenario */
            .addCase(fetchPostsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchPostsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(fetchPostsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for POST scenario */

            .addCase(createPostsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(createPostsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts.push(action.payload);
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(createPostsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for DELETE scenario */

            .addCase(destroyPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(destroyPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(destroyPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for PUT scenario */

            .addCase(updatePostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.posts.findIndex(post => post.id === action.payload.id);
                    draftState.posts[index] = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(updatePostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;