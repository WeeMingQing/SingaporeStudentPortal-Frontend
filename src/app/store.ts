import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postSlice';
import authenticationReducer from "../features/authentication/authenticationSlice"
import communitiesReducer from '../features/communities/communitySlice';
import commentsReducer  from '../features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    authentication: authenticationReducer,
    communities: communitiesReducer,
    comments: commentsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
