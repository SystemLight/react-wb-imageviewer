import React, {useState} from "react";
import ReactDOM from 'react-dom';

import {WbImageViewer} from "./wbImageViewer";


let app = document.createElement("div");
app.id = "app";
document.body.insertBefore(app, document.body.childNodes[0]);

function App() {
    let [open, setOpen] = useState(false);
    let [size, setSize] = useState(100);

    return (
        <div>
            <button onClick={() => {
                setOpen(true);
            }}>打开图片
            </button>

            <button onClick={() => {
                setSize(size + 100);
            }}>增加一百
            </button>

            <WbImageViewer visibility={open} src={"https://via.placeholder.com/" + size} onClose={() => {
                setOpen(false)
            }}/>
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);