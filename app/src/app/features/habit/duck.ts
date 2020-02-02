import {Thunk} from "app/Store";
import {Habit} from "generated/models";
import {Action, Reducer} from "redux";
import {serialise} from "util/date";
import {notifyWithMessage} from "util/duckUtil";
import {habitApi} from "util/fetch";

// State
export type HabitsState = {
    habits: { [id: string]: Habit };
    values: { [date: string]: { [id: string]: number } }
};

const initialState: HabitsState = {
    habits: {},
    values: {}
};

export const loadHabits = (): Thunk => async (dispatch) => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    habitApi.getHabits({from, to: new Date()}).then(value => {
            dispatch(addHabit({habits: value.habits}));
            dispatch(setValuesAction({values: value.dateValue}));
        }
    );
};

// Actions

type AddHabit = { habits: Habit[] };
type AddHabitAction = AddHabit & Action<'ADD_HABIT'>;
export const addHabit = (input: AddHabit): AddHabitAction => ({type: 'ADD_HABIT', ...input});

type SetValues = { values: { [key: string]: { [key: string]: number } } };
type SetValuesAction = SetValues & Action<'SET_VALUE'>;
export const setValuesAction = (input: SetValues): SetValuesAction => ({type: 'SET_VALUE', ...input});

export const updateHabitValue = (date: Date, value: number, habit: string): Thunk => async (dispatch, getState) => {
    // Set right away to improve responsiveness
    const dateKey = serialise(date);
    let values = {[dateKey]: {[habit]: value}};
    dispatch(setValuesAction({values}));
    habitApi.postHabitsWithHabit({habit, habitValueRequest: {date, value}})
            .catch(notifyWithMessage("Failed to update habit: ", dispatch));
};

export type HabitsAction = SetValuesAction | AddHabitAction;

// Reducer

export const habitsReducer: Reducer<HabitsState, HabitsAction> = (state = initialState, action): HabitsState => {
    switch (action.type) {
        case "ADD_HABIT":
            let habits = {...state.habits};
            action.habits.forEach(habit => habits[habit.id] = habit);
            return {...state, habits: habits};
        case "SET_VALUE":
            const values = {...state.values};
            Object.keys(action.values).forEach(date => {
                const dateValues = {...values[date]};
                Object.assign(dateValues, action.values[date]);
                values[date] = dateValues;
            });
            return {...state, values: values};
        default:
            return state;
    }
};
