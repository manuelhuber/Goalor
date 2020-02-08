import {notify} from "app/features/notifications/duck";
import {Thunk} from "app/Store";
import {Goal} from "generated/models";
import {Action, Reducer} from "redux";
import {goalApi} from "util/fetch";

// API calls -----------------------------------------------------------------------------------------------------------

export const addGoals = (goal: Goal): Thunk => async (dispatch) => {
    goal.children = goal.children || [];
    goalApi.postGoals({goalData: {...goal}})
           .then(x => dispatch(addGoalsAction(x)))
           .catch((e) => dispatch(notify({message: "Error creating goals"})));
};

export const updateGoal = (goal: Goal): Thunk => async (dispatch) => {
    goalApi.putGoalsWithId({id: goal.id, goalData: {...goal}}).then((update) => {
        dispatch(loadAllGoals())
    });
};

export const deleteGoal = (id: string): Thunk => async (dispatch) => {
    goalApi.deleteGoalsWithId({id: id}).then(() => {
        dispatch(deleteGoalAction(id));
        dispatch(loadAllGoals());
    });
};

export const loadAllGoals = (): Thunk => async (dispatch) => {
    goalApi.getGoals().then(goals => dispatch(addGoalsAction(goals)))
};

// State ---------------------------------------------------------------------------------------------------------------

export type GoalState = {
    goalsById: { [key: string]: Goal };
};

const initialState: GoalState = {
    goalsById: {}
};

// Actions -------------------------------------------------------------------------------------------------------------

type AddGoalsAction = { goal: Goal[] } & Action<"ADD_GOALS">;
const addGoalsAction = (goal: Goal | Goal[]): AddGoalsAction => ({
    type: "ADD_GOALS",
    goal: Array.isArray(goal) ? goal : [goal]
});

type DeleteGoalAction = { id: string } & Action<'REMOVE_GOAL'>;
const deleteGoalAction = (id: string): DeleteGoalAction => ({type: 'REMOVE_GOAL', id});

export type GoalAction = AddGoalsAction | DeleteGoalAction;

// Reducer -------------------------------------------------------------------------------------------------------------

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    const newGoals = {...state.goalsById};
    switch (action.type) {
        case "REMOVE_GOAL":
            delete newGoals[action.id];
            return {...state, goalsById: newGoals};
        case "ADD_GOALS":
            action.goal.forEach(goal => {
                newGoals[goal.id] = goal;
            });
            return {...state, goalsById: newGoals};
        default:
            return state;
    }
};

