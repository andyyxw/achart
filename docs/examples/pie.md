# 饼图

## 参数

### id

- 参数类型：String
- 描述：指定对应 canvas 的 id

### data

- Array
- 描述：可视化数据

### position

- 参数类型：String
- 描述：自定义属性区取值，分别 映射至 名称 和 数量

## 示例

```js
import { PieChart } from "ycharts";
const data = [
  { name: "芳华", value: 40 },
  { name: "妖猫传", value: 20 },
  { name: "机器之血", value: 18 },
  { name: "心理罪", value: 15 },
  { name: "寻梦环游记", value: 5 },
  { name: "其他", value: 2 },
];
const chart = new PieChart({
  id: "container",
  data,
  position: "name*value",
});
chart.render();
```

### [在线示例](https://andy.city/ycharts/demos/PieChart.html)
