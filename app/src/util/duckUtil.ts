import {NamespacedAction} from "model/NamespacedAction";
import {Reducer} from "redux";

export function namespacedReducer<S, A extends NamespacedAction<any>>(reducer: Reducer<S, A>, namespace: string): Reducer<S, A> {
    return (state: S, action: A) => {
        if (action.namespace !== namespace) return state;
        return reducer(state, action);
    }
}
