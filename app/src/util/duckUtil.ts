import {NamespacedAction} from "model/NamespacedAction";
import {Action, ActionCreator, ActionCreatorsMapObject, bindActionCreators, Dispatch, Reducer} from "redux";

export function namespacedReducer<S, A extends NamespacedAction<any>>(
    reducer: Reducer<S, A>,
    namespace: string): Reducer<S, A> {
    return (state: S, action: A) => {
        if (action.namespace !== namespace) return state;
        return reducer(state, action);
    }
}

export function bindActions<A, C extends ActionCreatorsMapObject<A>>(actions: C) {
    return (dispatch: Dispatch): C => bindActionCreators(actions, dispatch)
}
