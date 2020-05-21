import {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {TouchGesture} from "./touch";


export function useRollingPenetration(visibility: boolean): [string, Dispatch<SetStateAction<string>>] {
    // 防止滚动穿透
    let [visibleStyle, setVisibleStyle] = useState("none");

    useEffect(() => {
        if (visibility) {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
            setVisibleStyle("block");
        } else {
            let body = document.body;
            let top = body.style.top;
            body.style.position = '';
            body.style.top = '';
            document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
        }
    }, [visibility]);

    return [visibleStyle, setVisibleStyle];
}
