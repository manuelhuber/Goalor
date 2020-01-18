import {Action, Reducer} from "redux";
import {Thunk} from "app/Store";
import {goalApi} from "util/fetch";
import {Goal} from "generated/models";
import {clone} from "util/object";
import {notify} from "app/features/notifications/duck";

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
    goal.children = goal.children || [];
    goalApi.postGoals({goalData: {...goal}})
           .then(x => dispatch(addGoalsAction(x)))
           .catch((e) => dispatch(notify({message: "Error creating goals"})));
};

type UpdateGoalAction = { goal: Goal } & Action<'UPDATE_GOAL'>;
const updateGoalAction = (goal: Goal): UpdateGoalAction => ({type: 'UPDATE_GOAL', goal: clone(goal)});
export const updateGoal = (goal: Goal): Thunk => async (dispatch) => {
    goalApi.putGoalsWithId({id: goal.id, goalData: {...goal}}).then((update) => {
        dispatch(loadAllGoals())
    });
};

type DeleteGoalAction = { id: string } & Action<'REMOVE_GOAL'>;
const deleteGoalAction = (id: string): DeleteGoalAction => ({type: 'REMOVE_GOAL', id});
export const deleteGoal = (id: string): Thunk => async (dispatch) => {
    goalApi.deleteGoalsWithId({id: id}).then(() => {
        dispatch(loadAllGoals())
    });
};

export type GoalAction = AddGoalsAction | UpdateGoalAction | DeleteGoalAction;

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

