import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {createSelector} from "reselect";


const selector = createSelector(
    state => {
        return state.example;
    },
    example => {
        return example.aboutText;
    }
);


export default function About(props) {
    let dispatch = useDispatch();
    let aboutText = useSelector(selector);

    return (
        <div>
            {aboutText}
            <br/>
            <button onClick={(e) => {
                dispatch({type: "TEST_ABOUT"})
            }}>改变内容
            </button>
        </div>
    );
}