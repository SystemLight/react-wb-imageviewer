import './style.less';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useRollingPenetration } from './utils/hook';
import { Transform2D } from './utils/transform2d';
import { TouchGesture } from './utils/touch';
export const Loading = (props) => {
    return (<div className={'loading ' + (props.className || '')}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>);
};
export const LoadingImg = forwardRef(function LoadingImgSource(props, ref) {
    const { src, loadingHeight } = props;
    const [loadComplete, setLoadComplete] = useState(false);
    return (<div className="loading-img" style={(loadComplete ? {} : { height: loadingHeight })}>
      {loadComplete ? '' : [
            <Loading key="loading" className="loading-icon"/>,
            <div key="mask" className="loading-mask"/>
        ]}
      {src ? <img ref={ref} alt={'图片'} src={src} onLoad={() => {
                setLoadComplete(true);
            }}/> : ''}
    </div>);
});
export function WbImageViewer(props) {
    const { src, visibility, onClose } = props;
    // 防止滚动穿透
    const [visibleStyle, setVisibleStyle] = useRollingPenetration(visibility);
    const imgDom = useRef(null);
    const wrapDom = useRef(null);
    const tg = useRef();
    useEffect(() => {
        if (src) {
            tg.current && tg.current.destroy();
            tg.current = new TouchGesture(imgDom.current);
            const t2d = new Transform2D(imgDom.current);
            t2d.setTranslate().setScale().setRotate();
            let relativeSca = 1;
            let offsetBottom = 0;
            tg.current.on('tap', function (e) {
                e.preventDefault();
                onClose();
                t2d.setTranslate().setScale();
            });
            tg.current.on('pressMove', function (e) {
                e.preventDefault();
                const { moveDistance: { x, y } } = e;
                t2d.setTranslate(x, y, true);
            });
            tg.current.on('pinch', function (e) {
                const { scale } = e;
                t2d.setScale(scale, function (val) {
                    const sca = relativeSca * val[1];
                    return sca < 0.6 ? 0.6 : sca;
                });
            });
            tg.current.on('tapUp', function () {
                if (wrapDom.current && imgDom.current) {
                    let [x, y] = t2d.getTranslate();
                    let [sca] = t2d.getScale();
                    if (sca < 1) {
                        t2d.setScale(1);
                        sca = 1;
                    }
                    else if (sca > 3) {
                        t2d.setScale(3);
                        sca = 3;
                    }
                    const allowOffsetW = imgDom.current.offsetWidth / 2 * (sca - 1);
                    if (x > allowOffsetW) {
                        x = allowOffsetW;
                    }
                    else if (x < -allowOffsetW) {
                        x = -allowOffsetW;
                    }
                    const allowOffsetH = imgDom.current.offsetHeight / 2 * (sca - 1);
                    if (y > allowOffsetH) {
                        y = allowOffsetH;
                    }
                    else if (y < -allowOffsetH + offsetBottom) {
                        y = -allowOffsetH + offsetBottom;
                    }
                    t2d.setTranslate(x, y);
                }
            });
            tg.current.on('tapDown', function (e) {
                offsetBottom = window.innerHeight - imgDom.current.offsetHeight;
                relativeSca = t2d.getScale()[0];
            });
            return () => {
                tg.current && tg.current.destroy();
            };
        }
    }, [src]);
    return (<div className={'wbv-wrap ' + (visibility ? 'visible' : 'un-visible')} style={{ display: visibleStyle }} ref={wrapDom} onAnimationEnd={() => {
            if (!visibility) {
                setVisibleStyle('none');
            }
        }}>
      <div className="wbv-modal">
        <LoadingImg ref={imgDom} src={src} loadingHeight={300}/>
      </div>
    </div>);
}
//# sourceMappingURL=wbImageViewer.jsx.map