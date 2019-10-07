import {NamespacedAction} from "model/NamespacedAction";
import {Reducer} from "redux";

export function replaceItem<T>(array: T[], updateIndex: number, replace: (T) => T) {
    return array.map((value, index) => {
        if (index !== updateIndex) {
            return value;
        } else {
            return replace(value);
        }
    });
}

export function namespacedReducer<S, A extends NamespacedAction<any>>(reducer: Reducer<S, A>, namespace: string): Reducer<S, A> {
    return (state: S, action: A) => {
        if (action.namespace !== namespace) return state;
        return reducer(state, action);
    }
}
