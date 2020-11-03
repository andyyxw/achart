# 快速上手

## 安装

```bash
> yarn add ycharts
# or
> npm i ycharts --save
```

成功安装完成之后，即可使用 `import` 进行引用。

```js
import YCharts from 'ycharts'
```

## 一分钟上手

下面是以一个基础的柱状图为例开始我们的第一个图表创建。

#### 1. 创建canvas标签

在页面上创建一个 `<canvas>` 并指定 `id`：

```
<canvas id="myChart" width="400" height="260"></canvas>
```

#### 2. 编写图表绘制代码

创建 `<canvas>` 标签后，我们就可以进行简单的图表绘制:

1. 创建 Chart 图表对象，指定图表 ID、指定图表的宽高、边距等信息；
2. 渲染图表。

```js
// ycharts对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

// Step 1: 创建 Chart 对象
const chart = new YCharts.ColumnChart({
  id: 'myChart',
  data, // 数据
  position: 'genre*sold' //由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
});

// Step 2: 渲染图表
chart.render();
```

完成上述两步之后，保存文件并用浏览器打开，一张柱状图就绘制成功了：<br />![](https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/54ad3af8-c30d-43ca-b0e8-e21c4ea3d438.png)
