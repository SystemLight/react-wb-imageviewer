# react-wb-imageviewer

[![NPM version](https://img.shields.io/npm/v/react-wb-imageviewer.svg)](https://www.npmjs.com/package/react-wb-imageviewer)

> 基于react的一个超级简易的移动端图片查看器。

### 安装

```
npm i react-wb-imageviewer
```

### 使用举例

```
<div id="app"></div>

<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://unpkg.com/react@latest/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@latest/umd/react-dom.development.js"></script>
<script src="./index.umd.js"></script>
<script type="text/babel">
  function App() {
    let [open, setOpen] = React.useState(false)

    return (
      <div>
        <button onClick={() => {
          setOpen(true)
        }}>打开图片
        </button>

        <WbImageViewer visibility={open}
                       src={'https://t7.baidu.com/it/u=2291349828,4144427007&fm=193&f=GIF'}
                       onClose={() => {
                         setOpen(false)
                       }} />
      </div>
    )
  }

  ReactDOM.createRoot(
    document.querySelector('#app')
  ).render(<App />)
</script>
```
