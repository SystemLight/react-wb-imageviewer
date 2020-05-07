import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {createSelector} from "reselect";


const selector = createSelector(
    state => {
        return state.example;
    },
    example => {
        return example.homeText;
    }
);

export default function Home(props) {
    let dispatch = useDispatch();
    let homeText = useSelector(selector);

    return (
        <div>
            {homeText}
            <br/>
            <button onClick={(e) => {
                dispatch({type: "TEST_HOME"})
            }}>改变内容
            </button>
        </div>
    );
}