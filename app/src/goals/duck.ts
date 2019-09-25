import {Action, Reducer} from "redux";

// State

export interface Step {
    text: string;
    done: boolean;
}

export interface Goal {
    id: string;
    title: string;
    steps: Step[];
}

export type GoalState = Goal[];

const initialState: GoalState = [{
        id: "1",
        title: "Create this site",
        steps: [
            {text: "Setup React boilerplate", done: false},
            {text: "Add redux", done: false},
            {text: "Design a My-Goal page", done: false},
            {text: "Refactoring / Cleanup", done: false},
        ]
    }]
;

// Actions

export interface AddGoal extends Action<"AddGoal"> {
    goal: Goal;
}

export const addGoal = (goal: Goal): AddGoal => ({type: "AddGoal", goal});


export interface CompleteGoal extends Action<"CompleteGoal"> {
    id: string;
    done: boolean;
}

export type GoalAction = AddGoal | CompleteGoal;

// Reducer

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    console.log(state);
    switch (action.type) {
        case 'AddGoal':
            return [action.goal, ...state];
        case "CompleteGoal":
            return state.map(goal => {
                if (goal.id !== action.id) {
                    return goal;
                }
                return {
                    ...goal,
                    done: action.done
                }
            });
        default:
            return state;
    }
};

