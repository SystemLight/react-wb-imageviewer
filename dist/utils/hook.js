import { useEffect, useState } from 'react';
/**
 * 防止滚动穿透
 *
 * @param visibility
 */
export function useRollingPenetration(visibility) {
    const [visibleStyle, setVisibleStyle] = useState('none');
    useEffect(() => {
        if (visibility) {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
            setVisibleStyle('block');
        }
        else {
            const body = document.body;
            const top = body.style.top;
            body.style.position = '';
            body.style.top = '';
            document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
        }
    }, [visibility]);
    return [visibleStyle, setVisibleStyle];
}
//# sourceMappingURL=hook.js.map