import {notify} from "app/features/notifications/duck";
import {Thunk} from "app/Store";
import {UserTO} from "generated/models";
import {Action, Reducer} from "redux";
import {userApi} from "util/fetch";

// API calls -----------------------------------------------------------------------------------------------------------

export const loadAccount = (): Thunk => async (dispatch) => {
    userApi(dispatch).getUser().then(value => {
        dispatch(setEmail(value.email));
        dispatch(setUsername(value.username));
        dispatch(setNames({first: value.firstName, last: value.lastName}))
    });
};

export const updateAccount = (userTO: UserTO): Thunk => async (dispatch) => {
    userApi(dispatch).putUser({userTO}).then(value => {
        dispatch(setEmail(value.email));
        dispatch(setUsername(value.username));
        dispatch(setNames({first: value.firstName, last: value.lastName}))
    }).then(() => dispatch(notify({message: "Update successful!"})));
};

// State ---------------------------------------------------------------------------------------------------------------

export type AccountState = {
    username: string,
    email: string,
    firstName: string,
    lastName: string
};

const initialState: AccountState = {email: "", username: "", firstName: "", lastName: ""};

// Actions -------------------------------------------------------------------------------------------------------------

type SetEmailAction = { newMail: string } & Action<'SET_EMAIL'>;
const setEmail = (newMail: string): SetEmailAction => ({type: 'SET_EMAIL', newMail});

type SetUsernameAction = { newUsername: string } & Action<'SET_USERNAME'>;
const setUsername = (newUsername: string): SetUsernameAction => ({type: 'SET_USERNAME', newUsername});

type SetNames = { first: string, last: string };
type SetNamesAction = SetNames & Action<'SET_NAMES'>;
const setNames = (input: SetNames): SetNamesAction => ({type: 'SET_NAMES', ...input});

export type AccountAction = SetEmailAction | SetUsernameAction | SetNamesAction;

// Reducer -------------------------------------------------------------------------------------------------------------

export const accountReducer: Reducer<AccountState, AccountAction> = (
    state = initialState,
    action): AccountState => {
    switch (action.type) {
        case "SET_EMAIL":
            return {...state, email: action.newMail};
        case "SET_USERNAME":
            return {...state, username: action.newUsername};
        case "SET_NAMES":
            return {...state, firstName: action.first, lastName: action.last};
        default:
            return state;
    }
};
