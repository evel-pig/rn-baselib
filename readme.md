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
2. 在项目根目录下执行: `node node_modules/@epig/rn-baselib/styles/custom.cli.js`

## 权限管理
### iOS
用到某个权限需在 `info.plist` 添加如下对应项
- 读取相册: `Privacy - Photo Library Usage Description`  
- 保存图片至相册: `Privacy - Photo Library Additions Usage Description`
- 相机: `Privacy - Camera Usage Description`
- 定位:
    + `Privacy - Location When In Use Usage Description`
    + `Privacy - Location Usage Description`
    + `Privacy - Location Always Usage Description`
    + `Privacy - Location Always and When In Use Usage Description`
- 通讯录: `Privacy - Contacts Usage Description`

### Android
用到某个权限需在 `AndroidManifest.xml` 添加如下对应项
- 读取相册: `<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>`
- 存入相册: `<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>`
- 相机: `<uses-permission android:name="android.permission.CAMERA"/>`
- 定位:
    + `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>`
    + `<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>`
    + `<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS"/>`
- 读取通讯录: `<uses-permission android:name="android.permission.READ_CONTACTS"/>`
- 编辑通讯录: `<uses-permission android:name="android.permission.WRITE_CONTACTS"/>`
- 读取短信: `<uses-permission android:name="android.permission.READ_SMS"/>`
- 编辑短信: `<uses-permission android:name="android.permission.WRITE_SMS"/>`
- 接收短信: `<uses-permission android:name="android.permission.RECEIVE_SMS"/>`
- 发送短信: `<uses-permission android:name="android.permission.SEND_SMS"/>`
- 读取通话记录: `<uses-permission android:name="android.permission.READ_CALL_LOG"/>`
- 编辑通话记录: `<uses-permission android:name="android.permission.WRITE_CALL_LOG"/>`
- 获取ip, wifi的mac地址: `<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>`