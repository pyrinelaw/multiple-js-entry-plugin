## multiple-js-entry-plugin

webpack 插件，动态载入 js 入口文件，webpack >= 4.0.0

### 使用示例

```javascript
const MultipleJsEntryPlugin = require('../../plugin/index.js');

new MultipleJsEntryPlugin({
    src: path.join(__dirname, '../src'),
    split: '-',
    level: 0,
    // 入口匹配 js 文件
    // entryFiles: '*/**/index.js',
    // 过滤条件
    // filter: (file) => {
    //     return true;
    // },
    // 文件路径 entry 格式化转化
    // 需要返回 entry name
    // format: (file) => {
    //     return entryName
    // },
})
```

### 参数说明

参数     | 类型 | 是否必传 | 默认值 | 说明
-------- | --- | --- | --- | ---
src | String | 是 | undefined | 动态匹配路径文件夹路径
split | String | 否 | ”-“ | 转换间隔，例如路径 a/b/c 转换为 a-b-c
level | Number | 否 | 0 | 匹配目录层级，0表示所有层级
entryFiles | String | 否 | */**/index.js | 动态匹配 js 规则
filter | Function | 否 | null | 根据文件路径地址过滤规则方法
format | Function | 否 | null | 根据文件路径地址动态格式化 entry name 方法