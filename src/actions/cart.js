import {ADD_PRODUCT_TO_CART, UPDATE_PRODUCT_QTY_IN_CART} from "./types";


export const addProductToCart = product => {
    return async dispatch => {
        try {
            dispatch({
                type: ADD_PRODUCT_TO_CART,
                payload: product
            })
        } catch (e) {
            console.log(e)
        }

    }
}

export const updateProductQty = (item, increase) => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_PRODUCT_QTY_IN_CART,
                payload: {item, increase}
            })
        } catch (e) {
            console.log(e)
        }

    }
}
