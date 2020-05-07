import React from "react";
import {Switch, Route} from "react-router-dom";


export default function RouteView(props) {
    let {routes} = props;

    return (
        <Switch>
            {routes.map(r => {
                return (
                    <Route key={r.id} path={r.path} exact={r.exact} component={r.component}/>
                )
            })}
        </Switch>
    );
}