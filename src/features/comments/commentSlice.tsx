import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {RootState} from "../../app/store";
import { fetchComments, createComment, destroyComment, updateComment } from "./commentAPI";


export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...", 
    UpToDate =  "Up To Date", 
    Deleted = "Deleted",
    Error = "Error"
}

export interface CommentFormData {
    comment: {
        id?: number;
        content: string;
        user_id: number;
        post_id: number;
        username: string;
    }
}

export interface CommentUpdateData {
    comment: {
        comment_id: number;
        comment: CommentState;
    }
}

export interface CommentDeleteData {
    comment: {
        id: number,

    }
}

export interface CommentState {
    id?: number;
    user_id: number,
    username: string,
    content: string;
    post_id: number;
    created_at?: any;
    updated_at?: any;
}

export interface CommentsState {
    comments: CommentState[];
    status: string;

}

export const fetchCommentsAsync = createAsyncThunk(
    "comments/fetchComments",
    async (index:string) => {
        const response = await fetchComments(index);
        return response;
    }
)


const initialState: CommentsState = {
    comments: [
        {
            id: 0,
            user_id: 0,
            username: "",
            post_id: 0,
            content: "",
            "created_at": "",
            "updated_at": "",
        }
    ], 
    status: Statuses.Initial
}

export const createCommentAsync = createAsyncThunk(
    "comments/createComments",
    async (payload: CommentFormData)=> {
        const response = await createComment(payload);
        return response;
    }
)

export const destroyCommentAsync = createAsyncThunk(
    'comments/deleteComments',
    async (payload: CommentDeleteData) => {
        const response = await destroyComment(payload);
        return response;
    }
)

export const updateCommentAsync = createAsyncThunk(
    'comments/updateComments',
    async(payload: CommentFormData) => {
        const response = await updateComment(payload);
        return response;
    }
)

export const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /** To provide cases for GET scenario */
            .addCase(fetchCommentsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.comments = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(fetchCommentsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for POST scenario */

            .addCase(createCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(createCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.comments?.push(action.payload);
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(createCommentAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for DELETE scenario */

            .addCase(destroyCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(destroyCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.comments = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(destroyCommentAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for PUT scenario */

            .addCase(updateCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(updateCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.comments?.findIndex(comments => comments.id === action.payload.id);
                    if (index) { 
                        draftState.comments[index] = action.payload;
                        draftState.status = Statuses.UpToDate;
                    }
                })
            })
            .addCase(updateCommentAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = commentsSlice.actions;

export const selectComments = (state: RootState) => state.comments.comments;

export const selectStatus = (state: RootState) => state.comments.status;

export default commentsSlice.reducer;