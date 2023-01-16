import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {RootState} from "../../app/store";
import { fetchUsers, createUsers, destroyUser, updateUser } from "./authenticationAPI";


export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...", 
    UpToDate =  "Up To Date", 
    Deleted = "Deleted",
    Error = "Error"
}

export interface AuthenticationFormData {
    user: {
        id?: number;
        username: string
        email: string
        password_digest: string
    }
}


export interface AuthenticationUpdateData {
    user: {
        user_id: number;
        user: AuthenticationState;
    }
}

export interface AuthenticationDeleteData {
    user: {
        id: number,
        username: string,

    }
}

export interface AuthenticationState {
    id?: number;
    username?: string;
    email?: string;
    password_digest?: string;
    created_at?: any;
    updated_at?: any;
}

export interface AuthenticationsState {
    users: AuthenticationState[];
    status: string;

}

export const fetchUsersAsync = createAsyncThunk(
    "users/fetchUsers",
    async () => {
        const response = await fetchUsers();
        return response;
    }
)


const initialState: AuthenticationsState = {
    users: [
        {
            id: 0,
            username:"",
            email: "",
            password_digest: "",
            "created_at": "",
            "updated_at": "",
        }
    ], 
    status: Statuses.Initial
}

export const createUsersAsync = createAsyncThunk(
    "user/createUsers",
    async (payload: AuthenticationFormData)=> {
        const response = await createUsers(payload);
        return response;
    }
)

export const destroyUserAsync = createAsyncThunk(
    'users/deleteUser',
    async (payload: AuthenticationDeleteData) => {
        const response = await destroyUser(payload);
        return response;
    }
)

export const updateUserAsync = createAsyncThunk(
    'users/updateUser',
    async(payload: AuthenticationFormData) => {
        const response = await updateUser(payload);
        return response;
    }
)

export const authenticationSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /** To provide cases for GET scenario */
            .addCase(fetchUsersAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchUsersAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.users = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(fetchUsersAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for User scenario */

            .addCase(createUsersAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(createUsersAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.users.push(action.payload);
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(createUsersAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for DELETE scenario */

            .addCase(destroyUserAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(destroyUserAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.users = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(destroyUserAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })

            /** To provide cases for PUT scenario */

            .addCase(updateUserAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.users.findIndex(User => User.id === action.payload.id);
                    draftState.users[index] = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(updateUserAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = authenticationSlice.actions;

export const selectAuthentication = (state: RootState) => state.authentication.users;

export const selectStatus = (state: RootState) => state.authentication.status;

export default authenticationSlice.reducer;