import {Action, Reducer} from "redux";
import {Thunk} from "app/Store";
import {goalApi} from "util/fetch";
import {Goal} from "generated/models";
import {clone} from "util/object";

export type GoalState = {
    goalsById: { [key: string]: Goal };
};

const initialState: GoalState = {
    goalsById: {}
};

// Actions

type AddGoalsAction = { goal: Goal[] } & Action<"ADD_GOALS">;
const addGoalsAction = (goal: Goal | Goal[]): AddGoalsAction => ({
    type: "ADD_GOALS",
    goal: Array.isArray(goal) ? goal : [goal]
});
export const addGoals = (goal: Goal): Thunk => async (dispatch) => {
    goal.id = Date.now().toString();
    goal.children = [];
    dispatch(addGoalsAction(goal));
};

type UpdateGoalAction = { goal: Goal } & Action<'UPDATE_GOAL'>;
const updateGoalAction = (goal: Goal): UpdateGoalAction => ({type: 'UPDATE_GOAL', goal: clone(goal)});
export const updateGoal = (goal: Goal): Thunk => async (dispatch) => {
    // make call
    dispatch(updateGoalAction(goal));
};
type RemoveGoalAction = { id: string } & Action<'REMOVE_GOAL'>;
export const removeGoal = (id: string): RemoveGoalAction => ({type: 'REMOVE_GOAL', id});

export type GoalAction = AddGoalsAction | UpdateGoalAction | RemoveGoalAction;

export const loadAllGoals = (): Thunk => async (dispatch) => {
    goalApi.getGoals({}).then(goals => dispatch(addGoalsAction(goals)))
};
// Reducer

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    const newGoals = {...state.goalsById};
    switch (action.type) {
        case "UPDATE_GOAL":
            newGoals[action.goal.id] = action.goal;
            return {...state, goalsById: newGoals};
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

