import {SELECT_CURRENT_CURRENCY} from "./types";

export const selectCurrentCurrency = currency => {
    return async dispatch => {
        try {
            dispatch({
                type: SELECT_CURRENT_CURRENCY,
                payload: currency
            })
        } catch (e) {
            console.log(e)
        }

    }
}
