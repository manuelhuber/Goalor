import {Thunk} from "app/Store";
import {Habit} from "generated/models";
import {Action, Reducer} from "redux";
import {serialise} from "util/date";
import {habitApi} from "util/fetch";

// API calls -----------------------------------------------------------------------------------------------------------

export const loadHabits = (): Thunk => async (dispatch) => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    habitApi(dispatch).getHabits({from, to: new Date()}).then(value => {
            dispatch(setHabits(value.habits));
            dispatch(setValuesAction({values: value.dateValue}));
        }
    );
};

export const createHabit = (title: string, options: number): Thunk => async (dispatch) => {
    habitApi(dispatch).postHabits({habitRequest: {title, options}}).then(value => {
        dispatch(setHabits([value]));
    });
};

export const updateHabitValue = (date: Date, value: number, habit: string): Thunk => async (dispatch, getState) => {
    // Set right away to improve responsiveness
    const dateKey = serialise(date);
    let values = {[dateKey]: {[habit]: value}};
    dispatch(setValuesAction({values}));
    habitApi(dispatch).postHabitsWithHabit({habit, habitValueRequest: {date, value}});
};

export const deleteHabit = (habit: string): Thunk => async (dispatch) => {
    habitApi(dispatch).deleteHabitsWithHabit({habit}).then(() => dispatch(removeHabit({id: habit})));
};

export const updateHabit = (habit: Habit): Thunk => async (dispatch) => {
    dispatch(setHabits([habit]));
    habitApi(dispatch).putHabitsWithHabit({habit: habit.id, habitRequest: {...habit}});
};

// State ---------------------------------------------------------------------------------------------------------------
export type HabitsState = {
    habits: { [id: string]: Habit };
    values: { [date: string]: { [id: string]: number } }
};

const initialState: HabitsState = {
    habits: {},
    values: {}
};

// Actions -------------------------------------------------------------------------------------------------------------

type SetHabitsAction = { habits: Habit[] } & Action<'SET_HABITS'>;
const setHabits = (habits: Habit[]): SetHabitsAction => ({type: 'SET_HABITS', habits});

type SetValues = { values: { [key: string]: { [key: string]: number } } };
type SetValuesAction = SetValues & Action<'SET_VALUES'>;
const setValuesAction = (input: SetValues): SetValuesAction => ({type: 'SET_VALUES', ...input});

type RemoveHabit = { id: string };
type RemoveHabitAction = RemoveHabit & Action<'REMOVE_HABIT'>;
const removeHabit = (input: RemoveHabit): RemoveHabitAction => ({type: 'REMOVE_HABIT', ...input});

export type HabitsAction = SetValuesAction | SetHabitsAction | RemoveHabitAction ;

// Reducer -------------------------------------------------------------------------------------------------------------

export const habitsReducer: Reducer<HabitsState, HabitsAction> = (state = initialState, action): HabitsState => {
    let habits = {...state.habits};
    const values = {...state.values};
    switch (action.type) {
        case "SET_HABITS":
            action.habits.forEach(habit => habits[habit.id] = habit);
            return {...state, habits};
        case "SET_VALUES":
            for (const [date, newValues] of Object.entries(action.values)) {
                const dateValues = {...values[date]};
                Object.assign(dateValues, newValues); // Override & add new values
                values[date] = dateValues;
            }
            return {...state, values: values};
        case "REMOVE_HABIT":
            delete habits[action.id];
            for (const [dates, entries] of Object.entries(values)) {
                if (entries[action.id]) {
                    const update = {...entries};
                    delete entries[action.id];
                    values[dates] = update
                }
            }
            return {...state, values, habits};
        default:
            return state;
    }
};
