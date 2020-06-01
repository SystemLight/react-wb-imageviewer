# react-wb-imageviewer

基于react的一个超级简易的移动端图片查看器。

### 安装

```
npm i react-wb-imageviewer
```

### 使用举例

```
import {WbImageViewer} from 'react-wb-imageviewer';

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

            <WbImageViewer visibility={open}
                           src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590129044338&di=81ba9a84dc6cb42dc97ca43dc989f730&imgtype=0&src=http%3A%2F%2Fwx3.sinaimg.cn%2Forj360%2F78e1be4dly1ge0zhqkgxuj20u09fmx6p.jpg"}
                           onClose={() => {
                               setOpen(false)
                           }}/>
        </div>
    )
}
```