# 折线图

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
import { LineChart } from 'ycharts'
const data = [
  { date: '2010-01-10', type: '能源', value: 99.9 },
  { date: '2010-01-10', type: '金属', value: 96.6 },
  { date: '2010-01-10', type: '农副产品', value: 96.2 },
  { date: '2010-02-10', type: '能源', value: 96.7 },
  { date: '2010-02-10', type: '金属', value: 91.1 },
  { date: '2010-02-10', type: '农副产品', value: 93.4 },
  { date: '2010-03-10', type: '能源', value: 100.2 },
  { date: '2010-03-10', type: '金属', value: 99.4 },
  { date: '2010-03-10', type: '农副产品', value: 91.7 }
]
const chart = new LineChart({
  id: 'container',
  data,
  position: 'date*value'
})
chart.render()
```

### [在线示例](https://andy.city/ycharts/demos/LineChart.html)
