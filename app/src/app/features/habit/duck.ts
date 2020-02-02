import {Thunk} from "app/Store";
import {Action, Reducer} from "redux";

export type CheckinType = "check" | "bool" | "mood";

export type Habit = { id: string, title: string, options: number }
export type HabitValue = { habit: string, value: number }
// State
export type HabitsState = {
    habits: { [id: string]: Habit };
    values: { [date: string]: { [id: string]: HabitValue } }
};

const initialState: HabitsState = {
    habits: {
        "1": {id: "1", title: "Exercised", options: 1},
        "2": {id: "2", title: "Ate healthy", options: 2},
        "3": {id: "3", title: "Enjoyed work", options: 3},
        "4": {id: "4", title: "Yes?", options: 4},
        "5": {id: "5", title: "Overall mood", options: 5},
    },
    values: {
        "2020-02-01": {
            "1": {habit: "1", value: 1},
            "2": {habit: "2", value: -1},
            "5": {habit: "5", value: 2},
        }, "2020-01-30": {
            "2": {habit: "2", value: -1},
            "3": {habit: "3", value: 0},
            "4": {habit: "4", value: 1},
            "5": {habit: "5", value: -2},
        }
    }
};

// Actions

type SetValue = { key: string, value: any, date: string };
type SetValueAction = SetValue & Action<'SET_VALUE'>;
export const setValueAction = (input: SetValue): SetValueAction => ({type: 'SET_VALUE', ...input});
export const setHabitValue = (update: SetValue): Thunk => async (dispatch) => {
    // Call backend
    dispatch(setValueAction(update));
};

export type HabitsAction = SetValueAction;

// Reducer

export const habitsReducer: Reducer<HabitsState, HabitsAction> = (state = initialState, action): HabitsState => {
    switch (action.type) {
        case "SET_VALUE":
            const dateData = {...state.values[action.date]};
            dateData[action.key] = {habit: action.key, value: action.value};
            const values = {...state.values};
            values[action.date] = dateData;
            return {...state, values: values};
        default:
            return state;
    }
};
