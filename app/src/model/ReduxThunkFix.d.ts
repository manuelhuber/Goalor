import {ActionCreatorsMapObject, Dispatch,} from 'redux';

/**
 * Without the following fix the props in components aren't correct:
 * A thunk prop would be of type
 * (actualParams) => (dispatch) => Promise<ActualReturnType>
 * With this fix it will be
 * (actualParams) => Promise<ActualReturnType>
 * Thus we can use the returned Promise in the UI
 */

/**
 * Redux behaviour changed by middleware, so overloads here
 */
declare module 'redux' {
    import {ThunkAction} from "redux-thunk";

    /**
     * Overload for bindActionCreators redux function, returns expects responses
     * from thunk actions
     */
    function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
        actionCreators: M,
        dispatch: Dispatch
    ): {
        [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
            ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
            : M[N]
    };
}
