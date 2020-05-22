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


export function Loading(props: { className?: string }) {
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


export const LoadingImg = forwardRef<HTMLImageElement, LoadingImgProps>(function (props, ref) {
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

            let relativeSca = 1;
            let offsetBottom = 0;

            tg.current.on("tap", function (e) {
                e.preventDefault();
                onClose();
                t2d.setTranslate().setScale();
            });

            tg.current.on("pressMove", function (e) {
                e.preventDefault();
                let {moveDistance: {x, y}} = e;
                t2d.setTranslate(x, y, true);
            });
            tg.current.on("pinch", function (e) {
                let {scale} = e;
                t2d.setScale(scale, function (val) {
                    let sca = relativeSca * val[1];
                    return sca < 0.6 ? 0.6 : sca;
                });
            });

            tg.current.on("tapUp", function () {
                if (wrapDom.current && imgDom.current) {
                    let [x, y] = t2d.getTranslate();
                    let [sca] = t2d.getScale();
                    if (sca < 1) {
                        t2d.setScale(1);
                        sca = 1;
                    } else if (sca > 3) {
                        t2d.setScale(3);
                        sca = 3;
                    }

                    let allowOffsetW = imgDom.current.offsetWidth / 2 * (sca - 1);
                    if (x > allowOffsetW) {
                        x = allowOffsetW;
                    } else if (x < -allowOffsetW) {
                        x = -allowOffsetW;
                    }

                    let allowOffsetH = imgDom.current.offsetHeight / 2 * (sca - 1);
                    if (y > allowOffsetH) {
                        y = allowOffsetH;
                    } else if (y < -allowOffsetH + offsetBottom) {
                        y = -allowOffsetH + offsetBottom;
                    }

                    t2d.setTranslate(x, y);
                }
            });
            tg.current.on("tapDown", function (e) {
                offsetBottom = window.innerHeight - (imgDom.current as HTMLImageElement).offsetHeight;
                relativeSca = t2d.getScale()[0];
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
