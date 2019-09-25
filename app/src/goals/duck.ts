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

export type GoalState = {
    ids: string[];
    goals: { [key: string]: Goal }
};

const initialState: GoalState = {
    ids: ['1'],
    goals: {
        '1': {
            id: "1",
            title: "Create this site",
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
type AddGoalAction = AddGoal & Action<'ADD_GOAL'>;
export const addGoal = (input: AddGoal): AddGoalAction => ({type: 'ADD_GOAL', ...input});

type CompleteGoal = {
    id: string;
    step: number;
    done: boolean;
};
type CompleteGoalAction = CompleteGoal & Action<'COMPLETE_GOAL'>;
export const completeGoal = (input: CompleteGoal): CompleteGoalAction => ({type: 'COMPLETE_GOAL', ...input});

export type GoalAction = AddGoalAction | CompleteGoalAction;

// Reducer

export const goalReducer: Reducer<GoalState, GoalAction> = (state = initialState, action): GoalState => {
    let id;
    switch (action.type) {
        case 'ADD_GOAL':
            id = action.goal.id;
            return {
                ...state,
                ids: state.ids.concat(id),
                goals: {...state.goals, [id]: action.goal}
            };
        case "COMPLETE_GOAL":
            id = action.id;
            const updatedState = completeStep(state.goals[id], action.step, action.done);
            return {
                ...state,
                goals: {...state.goals, [id]: updatedState}
            };
        default:
            return state;
    }
};

function completeStep(goal: Goal, step: number, done: boolean): Goal {
    const steps = goal.steps.map((value, index) => {
        if (index !== step) {
            return value;
        } else {
            return {
                ...value,
                done: done
            }
        }
    });
    return {...goal, steps}
}
