# react-wb-imageviewer

基于react的一个超级简易的移动端图片查看器，致力于效仿微博效果。

### 安装

```
npm i react-wb-imageviewer
```

### 使用

```
import {WbImageViewer} from 'react-wb-imageviewer';

<WbImageViewer src={"https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpg"}
               visibility={visibility}
               onClose={() => {
                   setVisibility(false)
               }}/>
```