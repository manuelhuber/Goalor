import {Action, Reducer} from "redux";
import {replaceItem} from "../../../util/DuckUtil";

// State
export interface Step {
    text: string;
    done: boolean;
}

export interface Goal {
    id: string;
    title: string;
    image: string;
    steps: Step[];
}

export type GoalState = {
    ids: string[];
    goals: { [key: string]: Goal }
};

const initialState: GoalState = {
    ids: ["1"],
    goals: {
        "1": {
            id: "1",
            title: "Create this site",
            image: "https://labs.lullabot.com/user/pages/01.home/09.react-redux-boilerplate/reactredux.png",
            steps: [
                {text: "Setup React boilerplate", done: false},
                {text: "Add redux", done: false},
                {text: "Design a My-GoalCard page", done: false},
                {text: "Refactoring / Cleanup", done: false},
            ]
        }
    }
};

// Actions

type AddGoal = { goal: Goal };
type AddGoalAction = AddGoal & Action<"ADD_GOAL">;
export const addGoal = (input: AddGoal): AddGoalAction => ({type: "ADD_GOAL", ...input});

type CompleteGoal = {
    id: string;
    step: number;
    done: boolean;
};
type CompleteGoalAction = CompleteGoal & Action<"COMPLETE_GOAL">;
export const completeGoal = (input: CompleteGoal): CompleteGoalAction => ({type: "COMPLETE_GOAL", ...input});

export type GoalAction = AddGoalAction | CompleteGoalAction;

// Reducer

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    switch (action.type) {
        case "ADD_GOAL":
            return {
                ...state,
                ids: state.ids.concat(action.goal.id),
                goals: {...state.goals, [action.goal.id]: action.goal}
            };
        case "COMPLETE_GOAL":
            const updatedState = completeStep(state.goals[(action.id)], action.step, action.done);
            return {
                ...state,
                goals: {...state.goals, [action.id]: updatedState}
            };
        default:
            return state;
    }
};

function completeStep(goal: Goal, step: number, done: boolean): Goal {
    const steps = replaceItem(goal.steps, step, step => ({...step, done: done}));
    return {...goal, steps}
}
