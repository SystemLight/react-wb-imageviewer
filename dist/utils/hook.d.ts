import { Dispatch, SetStateAction } from 'react';
/**
 * 防止滚动穿透
 *
 * @param visibility
 */
export declare function useRollingPenetration(visibility: boolean): [string, Dispatch<SetStateAction<string>>];
