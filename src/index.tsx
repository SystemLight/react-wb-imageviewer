import './index.less';

import React, {useState, useRef, useEffect} from 'react';


export function WbImageViewer(props: {
    src: string,
    visibility: boolean,
    onClose: () => void
}) {
    let {src, visibility, onClose} = props;
    let [visibleStyle, setVisibleStyle] = useState("none");
    let imageOffset = useRef({x: 0, y: 0});
    let tapStart = useRef({x: 0, y: 0});
    let tapFlag = useRef(false);
    let imgDom = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        let eve = function () {
            tapFlag.current = false;
            if (imgDom.current) {
                imgDom.current.style.transform = `translate(0px,0px)`;
            }
            imageOffset.current = {x: 0, y: 0};
        };
        document.addEventListener("touchend", eve);
        return () => {
            document.removeEventListener("touchend", eve)
        }
    }, []);
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

    return (
        <div className={"wbv-wrap " + (visibility ? "visible" : "un-visible")}
             style={{display: visibleStyle}}
             onAnimationEnd={(e) => {
                 if (!visibility) {
                     setVisibleStyle("none");
                 }
             }}
             onClick={() => {
                 onClose && onClose();
             }}>
            <div className="wbv-modal">
                <img ref={imgDom} src={src} alt="大图"
                     onTouchStart={(e) => {
                         tapFlag.current = true;
                         tapStart.current = {
                             x: e.touches[0].clientX,
                             y: e.touches[0].clientY
                         };
                     }}
                     onTouchMove={(e) => {
                         if (tapFlag.current) {
                             let {x, y} = tapStart.current;
                             let {x: ox, y: oy} = imageOffset.current;
                             ox += e.touches[0].clientX - x;
                             oy += e.touches[0].clientY - y;
                             (e.target as HTMLImageElement).style.transform = `translate(${ox}px,${oy}px)`;
                             tapStart.current = {x: e.touches[0].clientX, y: e.touches[0].clientY};
                             imageOffset.current = {x: ox, y: oy};
                         }
                     }}
                />
            </div>
        </div>
    )
}
