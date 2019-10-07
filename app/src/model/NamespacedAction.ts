import {Action} from "redux";

export interface NamespacedAction<T> extends Action<T> {
    namespace: string;
}
