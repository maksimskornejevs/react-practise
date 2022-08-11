import { combineReducers } from "redux";
import { cartReducer } from "./cart";
import { catalogReducer } from "./catalog";
import { currencyReducer } from "./currency";

export default combineReducers({
    catalog: catalogReducer,
    cart: cartReducer,
    currentCurrency: currencyReducer
})
