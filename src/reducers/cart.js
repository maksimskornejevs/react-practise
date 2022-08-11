import { ADD_PRODUCT_TO_CART, UPDATE_PRODUCT_QTY_IN_CART } from "../actions/types";
import { isEqual } from 'lodash';

const storedCart = JSON.parse(localStorage.getItem('items'));

let defaultState = {
    items: storedCart && storedCart.items ? storedCart.items : []
}

export const cartReducer = (state = defaultState, action) => {
    
    switch (action.type) {
        case ADD_PRODUCT_TO_CART:
            const { product, selectedAttributes } = action.payload;
            const { id } = product;
            let { items } = state
            const existingProducts = items.filter(cartItem => cartItem.product.id === id);
            let addNewProduct = true;

            if (existingProducts.length) {
                for (let cartItem of existingProducts) {
                    if(isEqual(cartItem.selectedAttributes, selectedAttributes)) {
                        cartItem.qty += 1
                        addNewProduct = false;
                        break
                    }
                }
            }

            if(addNewProduct) {
                const newItems = {...state, items: [...state.items, {
                    product,
                    qty: 1,
                    selectedAttributes: [ ...selectedAttributes ]
                }]}

                localStorage.setItem('items', JSON.stringify(newItems));

                return newItems;
            }

            localStorage.setItem('items', JSON.stringify(items));

            return {...state, items: [ ...state.items ]};
            
        case UPDATE_PRODUCT_QTY_IN_CART:
            const stockUpdateItem = action.payload.item;
            let itemToRemove = false

            for (let [index, item] of state.items.entries()) {
                if(isEqual(item, stockUpdateItem)) {
                    action.payload.increase ? item.qty += 1 : item.qty -= 1

                    if ( item.qty < 1 ) itemToRemove = index
                    break
                }
            }

            if (itemToRemove !== false) state.items.splice(itemToRemove, 1);

            localStorage.setItem('items', JSON.stringify(state));

            return {...state, items: [ ...state.items ]};
        default:
          return state;
      }
}
