import React from "react";
import {Redirect} from "react-router-dom";

import Home from "../views/home/home";


export let notFound = "/404";

export function dynamic(imp, Loading) {
    // 高阶组件，用于异步加载组件，这样可以让不同路由地址的组件分开加载
    let Com = React.lazy(() => imp);
    Loading = Loading || <></>;
    return () => {
        return (
            <React.Suspense fallback={Loading}>
                <Com/>
            </React.Suspense>
        );
    }
}

export function RedirectDefaultPage() {
    // 重定向到默认页面
    return (
        <Redirect to={"/home/attention/"}/>
    )
}

export function Redirect404() {
    // 重定向到404页面当中
    return (
        <Redirect to={notFound}/>
    )
}

export function NotFoundPage() {
    // 404页面
    return (
        <div>
            404:Not Found
        </div>
    );
}

const routes = [
    {
        id: "index",
        title: "主页",
        path: "/",
        component: RedirectDefaultPage,
        exact: true,
    },
    {
        id: "home", // 子路由homeRoutes
        title: "主页",
        path: "/home",
        component: Home,
    },
    {
        id: "about",
        title: "关于",
        path: "/about/:id",
        component: dynamic(import(/* webpackChunkName: "login" */'../views/about/about')),
        exact: true,
    },
    {
        id: "notFound",
        title: "未发现",
        path: ["*", "/404"],
        component: NotFoundPage
    }
];

// let home = "/home";
// export let homeRoutes = [
//     {
//         id: home + "attention",
//         title: "关注",
//         path: home + "/attention/:filter",
//         component: Attention,
//         exact: true,
//     },
//     {
//         id: home + "my",
//         title: "我的",
//         path: home + "/my",
//         component: My,
//         exact: true,
//     },
//     {
//         id: home + "notFound",
//         title: "无资源",
//         path: "*",
//         component: Redirect404
//     }
// ];

export default routes;