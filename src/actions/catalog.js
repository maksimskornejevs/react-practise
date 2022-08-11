import eCommerceApi from "../api/eCommerce";
import { Query } from '@tilework/opus';

import {FETCH_CATEGORIES} from "./types";

export const fetchCategories = () => {
    return async dispatch => {
        try {
            const categoryFields = ['name'];

            const categoriesQuery = new Query('categories', true)
                .addFieldList(categoryFields)
                

            const response = await eCommerceApi.post(categoriesQuery);

            dispatch({
                type: FETCH_CATEGORIES,
                payload: response.categories
            })
        } catch (e) {
            console.log(e)
        }
    }
}