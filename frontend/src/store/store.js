import {configureStore} from "@reduxjs/toolkit";
import avatarReducer from './avatarSlice';
import contentReducer from './contentSlice';

export const store=configureStore({
    reducer:{
        avatar: avatarReducer,
        content: contentReducer,
    },
});

