# 柱状图

## 参数

### id

- 参数类型：String
- 描述：指定对应 canvas 的 id

### data

- Array
- 描述：可视化数据（多条线时需要包含唯一的`type`）

### position

- 参数类型：String
- 描述：自定义属性区取值，分别 映射至 x 轴 和 y 轴

## 示例

```js
import { ColumnChart } from 'ycharts'
const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 145 },
  { year: '1958 年', sales: 48 },
  { year: '1959 年', sales: 38 },
  { year: '1960 年', sales: 38 },
  { year: '1962 年', sales: 38 }
]
const chart = new ColumnChart({
  id: 'container',
  data,
  position: 'year*sales'
})
chart.render()
```

### [在线示例](https://andy.city/ycharts/demos/ColumnChart.html)
