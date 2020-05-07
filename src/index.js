import './wbViewer.less';

import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

let image = "https://wx1.sinaimg.cn/orj360/7eb24ba3ly1geijqaz709j20j60yi75w.jpg";

function throttle(fn) {
    let flag = true;
    return (e) => {
        if (flag) {
            flag = false;
            let timer = setTimeout(() => {
                fn(e.touches);
                flag = true;
            }, 300);
        }
    }
}

function WbViewer(props) {
    let {src, visibility, onClose} = props;
    let [visibleStyle, setVisibleStyle] = useState("none");
    let imageOffset = useRef({x: 0, y: 0});
    let tapStart = useRef({x: 0, y: 0});
    let tapFlag = useRef(false);

    useEffect(() => {
        let eve = function () {
            tapFlag.current = false;
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
                <img src={src} alt="大图"
                     onTouchStart={(e) => {
                         tapFlag.current = true;
                         tapStart.current = {
                             x: e.touches[0].clientX,
                             y: e.touches[0].clientY
                         };
                     }}
                     onTouchMove={throttle((touches) => {
                         if (tapFlag.current) {
                             let {x, y} = tapStart.current;
                             let {x: ox, y: oy} = imageOffset.current;
                             // console.log(touches)
                             // ox += e.touches[0].clientX - x;
                             // oy += e.touches[0].clientY - y;
                             // e.target.style.transform = `translate(${ox}px,${oy}px)`;
                             // imageOffset.current = {x: ox, y: oy};
                         }
                     })}
                />
            </div>
        </div>
    )
}

function App(props) {
    let [visible, setVisible] = useState(false);

    return (
        <>
            <div style={{width: 100, height: 100}}>
                <div className="wbv-img">
                    <img src={image} alt="图片" style={{width: "100%"}} onClick={() => {
                        setVisible(true);
                    }}/>
                </div>
                <ul>
                    {new Array(200).fill(0).map((v, i) => {
                        return <li key={i} style={{height: 200, borderBottom: "1px solid red"}}>第{i}个元素</li>
                    })}
                </ul>
                <WbViewer src={[image]} visibility={visible} onClose={() => {
                    setVisible(false);
                }}/>
            </div>
        </>
    );
}

ReactDOM.render(
    // render中尽量不要放置其它组件或page，render中主要放置全局元组件
    <App/>
    , document.getElementById('main')
);
