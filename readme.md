# @epig/rn-baselib

## 安装
```bash
npm i @epig/rn-baselib --save
react-native link
```

#### 依赖到的第三方库
> need react-native link
1. `react-native-linear-gradient` (渐变控件);
2. `react-native-vector-icons` (SVG图片);
3. `react-native-gesture-handler`(react-navigation 3.x依赖);
4. `react-native-spinkit` (Loading动画);

## 模块
### components
抽离封装的UI控件

### styles
样式模块

### tools
公用方法模块

### model
创建model模块

### tips
#### 自定义主题颜色
1. 要自定义默认的主题颜色值(在`./styles/theme.ts`), 可以在项目根目录下新建一个`theme.json`文件, 在此文件内添加对应的颜色值; 如果`key`与`./styles/theme.ts`内的`key`相同则会覆盖, 如果没有相同的`key`, 则会新增颜色值.
2. 在项目根目录下执行: `node node_modules/rn-baselib/styles/custom.cli.js`
