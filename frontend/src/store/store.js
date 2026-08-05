import {configureStore} from "@reduxjs/toolkit";
import avatarReducer from './avatarSlice';
import contentReducer from './contentSlice';
import bookmarkReducer from './bookmarkSlice';

export const store=configureStore({
    reducer:{
        avatar: avatarReducer,
        content: contentReducer,
        bookmark: bookmarkReducer,
    },
});

