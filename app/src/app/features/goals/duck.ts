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
    types: string[];
}

export type GoalState = {
    active: string[];
    maybeSomeday: string[];
    goals: { [key: string]: Goal }
};

const initialState: GoalState = {
    active: ["1", "3", "4", "5"],
    maybeSomeday: ["2"],
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
            ],
            types: ["sport"],
        }, "2": {
            id: "2",
            title: "Learn Violine",
            image: "https://labs.lullabot.com/user/pages/01.home/09.react-redux-boilerplate/reactredux.png",
            steps: [],
            types: ["music"]
        }, "3": {
            id: "3",
            title: "Learn Spanish",
            image: "https://labs.lullabot.com/user/pages/01.home/09.react-redux-boilerplate/reactredux.png",
            steps: [],
            types: ["education"]
        }, "4": {
            id: "4",
            title: "Do 100 burpees",
            image: "https://labs.lullabot.com/user/pages/01.home/09.react-redux-boilerplate/reactredux.png",
            steps: [],
            types: ["sport"]
        }, "5": {
            id: "5",
            title: "Learn Violine",
            image: "https://labs.lullabot.com/user/pages/01.home/09.react-redux-boilerplate/reactredux.png",
            steps: [],
            types: ["education"]
        }
    }
};

// Actions

type AddGoal = { id: string };
type AddGoalAction = AddGoal & Action<"ADD_GOAL">;
export const addGoal = (id: string): AddGoalAction => ({type: "ADD_GOAL", id});

type CreateGoal = { goal: Goal };
type CreateGoalAction = CreateGoal & Action<"CREATE_GOAL">;
export const createGoal = (input: CreateGoal): CreateGoalAction => ({type: "CREATE_GOAL", ...input});

type CompleteGoal = {
    id: string;
    step: number;
    done: boolean;
};
type CompleteGoalAction = CompleteGoal & Action<"COMPLETE_GOAL">;
export const completeGoal = (input: CompleteGoal): CompleteGoalAction => ({type: "COMPLETE_GOAL", ...input});

export type GoalAction = AddGoalAction | CreateGoalAction | CompleteGoalAction;

// Reducer

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    switch (action.type) {
        case "ADD_GOAL":
            return {...state, active: state.active.concat(action.id)}
        case "CREATE_GOAL":
            return {
                ...state,
                active: state.active.concat(action.goal.id),
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
