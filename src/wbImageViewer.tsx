import './style.less';

import React, {useRef, useEffect, forwardRef, useState} from 'react';

import {useRollingPenetration} from "./utils/hook";
import {Transform2D} from "./utils/transform2d";
import {TouchGesture} from "./utils/touch";


type WbImageViewerProps = {
    src: string,
    visibility: boolean,
    onClose: () => void
};

type LoadingImgProps = {
    src?: string | null | "",
    alt?: string,
    loadingHeight: number | string
};


function Loading(props: { className?: string }) {
    return (
        <div className={"loading " + (props.className || "")}>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
        </div>
    );
}


const LoadingImg = forwardRef<HTMLImageElement, LoadingImgProps>(function (props, ref) {
    let {src, loadingHeight} = props;

    let [loadComplete, setLoadComplete] = useState(false);

    return (
        <div className="loading-img" style={(loadComplete ? {} : {height: loadingHeight})}>
            {loadComplete ? "" : [
                <Loading key="loading" className="loading-icon"/>,
                <div key="mask" className="loading-mask"/>
            ]}
            {src ? <img ref={ref} alt={"图片"} src={src} onLoad={() => {
                setLoadComplete(true);
            }}/> : ""}
        </div>
    )
});


export function WbImageViewer(props: WbImageViewerProps) {
    let {src, visibility, onClose} = props;

    // 防止滚动穿透
    let [visibleStyle, setVisibleStyle] = useRollingPenetration(visibility);

    let imgDom = useRef<HTMLImageElement | null>(null);
    let wrapDom = useRef<HTMLDivElement | null>(null);
    let tg = useRef<TouchGesture>();

    useEffect(() => {
        if (src) {
            tg.current && tg.current.destroy();
            tg.current = new TouchGesture((imgDom.current as HTMLImageElement));
            let t2d = new Transform2D((imgDom.current as HTMLImageElement));
            t2d.setTranslate().setScale().setRotate();

            tg.current.on("doubleTap", function (e) {
                // onClose();
                t2d.setScale(0.5, true);
            });
            tg.current.on("pressMove", function ({moveDistance: {x, y}}) {
                t2d.setTranslate(x, y, true);
            });
            tg.current.on("tapUp", function () {
                if (wrapDom.current && imgDom.current) {
                    let [x, y] = t2d.getTranslate();
                    let [sca] = t2d.getScale();
                    let boundaryX = wrapDom.current.offsetWidth / 2 - imgDom.current.offsetWidth * sca / 2;
                }
            });
            tg.current.on("pinch", function (e) {

            });

            return () => {
                tg.current && tg.current.destroy();
            }
        }
    }, [src]);


    return (
        <div className={"wbv-wrap " + (visibility ? "visible" : "un-visible")} style={{display: visibleStyle}}
             ref={wrapDom}
             onAnimationEnd={(e) => {
                 if (!visibility) {
                     setVisibleStyle("none");
                 }
             }}>
            <div className="wbv-modal">
                <LoadingImg ref={imgDom} src={src} loadingHeight={300}/>
            </div>
        </div>
    )
}
