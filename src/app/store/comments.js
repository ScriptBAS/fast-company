import { createAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter((c) => c._id !== action.payload);
        },
        commentCreated: (state, action) => {
            state.entities = [...state.entities, action.payload];
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const { commentsRequested, commentsReceived, commentsRequestFailed, commentRemoved, commentCreated } =
    actions;

const commentRemoveFailed = createAction("comments/commentRemoveFailed");
const commentCreateFailed = createAction("comments/commentCreateFailed");

export const loadCommentsList = (userId) => async (dispatch) => {
        dispatch(commentsRequested());
        try {
            const { content } = await commentService.getComments(userId);
            dispatch(commentsReceived(content));
        } catch (error) {
            dispatch(commentsRequestFailed(error.message));
        }
};

export const removeComment = (id) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(id);
        if (content === null) {
            dispatch(commentRemoved(id));
        }
    } catch (error) {
        dispatch(commentRemoveFailed());
    }
};

export const createComment = (data, userId, currentUserId) => async (dispatch) => {
    const comment = {
        ...data,
        _id: nanoid(),
        pageId: userId,
        created_at: Date.now(),
        userId: currentUserId
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentCreateFailed());
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
