import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';

import example from "./reducer/example";


export default createStore(combineReducers({
    example
}), applyMiddleware(thunk));
