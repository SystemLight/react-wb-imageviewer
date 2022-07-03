import './style.less';
import React from 'react';
declare type WbImageViewerProps = {
    src: string;
    visibility: boolean;
    onClose: () => void;
};
declare type LoadingImgProps = {
    src?: string | null | '';
    alt?: string;
    loadingHeight: number | string;
};
export declare const Loading: React.FC<{
    className?: string | undefined;
}>;
export declare const LoadingImg: React.ForwardRefExoticComponent<LoadingImgProps & React.RefAttributes<HTMLImageElement>>;
export declare function WbImageViewer(props: WbImageViewerProps): JSX.Element;
export {};
