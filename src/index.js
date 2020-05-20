import React from "react";
import ReactDOM from 'react-dom';

import {WbImageViewer} from "./wbImageViewer";


let app = document.createElement("div");
app.id = "app";
document.body.insertBefore(app, document.body.childNodes[0]);

ReactDOM.render(
    <div>
        <WbImageViewer visibility={true} src={""} onClose={() => {

        }}/>
    </div>,
    document.getElementById('app')
);