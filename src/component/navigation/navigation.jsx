import React from "react";
import {NavLink} from "react-router-dom";

import {http} from "../../store/action/action"
import routes from "../../routes/routes";


export default function Navigation(props) {
    http.get("/").then(function (res) {
        console.log("[Navigation组件] 代理请求数据测试：", res);
    });

    return (
        <div>
            {routes.map(item => {
                if (!item.isNav) {
                    return "";
                }
                return (
                    <NavLink key={item.id} to={item.to} isActive={(match, location) => false}>{item.title} | </NavLink>
                )
            })}
        </div>
    );
}