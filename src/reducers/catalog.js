import { FETCH_CATEGORIES } from "../actions/types";

let defaultState = {
    categories: [],
}

export const catalogReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES:
            if(state.currentCategory == '') {
                const defaultCurrentCategory = action.payload[0]
                return {...state, categories: action.payload, currentCategory: defaultCurrentCategory};
            }
            return {...state, categories: action.payload};
        default:
          return state;
      }
}
