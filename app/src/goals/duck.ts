import {Action, Reducer} from "redux";

export interface Step {
    text: string;
    done: boolean;
}

export interface Goal {
    id: string;
    title: string;
    steps: Step[];
}

export interface GoalState {
    goals: Goal[];
}

export interface AddGoal extends Action<"AddGoal"> {
    goal: Goal;
}

export const addGoal = (goal: Goal): AddGoal => ({type: "AddGoal", goal});


export interface CompleteGoal extends Action<"CompleteGoal"> {
    id: string;
    done: boolean;
}

export type GoalAction = AddGoal | CompleteGoal;

const initialState: GoalState = {
    goals: [{
        id: "1",
        title: "Create this site",
        steps: [
            {text: "Setup React boilerplate", done: false},
            {text: "Add redux", done: false},
            {text: "Design a My-Goal page", done: false},
            {text: "Refactoring / Cleanup", done: false},
        ]
    }]
};

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action) => {
    console.log(state);
    switch (action.type) {
        case 'AddGoal':
            return {...state, goals: [action.goal, ...state.goals]};
        case "CompleteGoal":
            const goals = state.goals.map(goal => {
                if (goal.id !== action.id) {
                    return goal;
                }
                return {
                    ...goal,
                    done: action.done
                }
            });
            return {
                ...state,
                goals
            };
        default:
            return state;
    }
};

