import { SELECT_CURRENT_CURRENCY } from "../actions/types";

let defaultState = { label: 'USD', symbol: '$' }

export const currencyReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SELECT_CURRENT_CURRENCY:
            const {label, symbol} = action.payload
            return { ...state, label, symbol}
        default:
          return state;
      }
}
