import makeHighRes from './utils/makeHighRes.js'

/**
 * 柱状图
 */
class ColumnChart {
  constructor (config) {
    this.config = config
    this.ctx = makeHighRes(config.id)
    const statistics = this.splitData()
    // 基本绘图配置
    const options = {
      chartZone: [50, 50, 1300, 600], // 坐标系的区域
      yAxisLabel: ['2100', '2150', '2200', '2250', '2300', '2350'], // y轴坐标
      xAxisLabel: statistics.categoryData, // x轴坐标
      data: statistics.values
    }
    options.yMax = Number(options.yAxisLabel[options.yAxisLabel.length - 1])
    options.yMin = Number(options.yAxisLabel[0])
    this.options = options
  }

  /**
   * 处理数据
   */
  splitData () {
    const categoryData = []
    const values = []
    this.config.data.forEach((item) => {
      categoryData.push(item[0])
      values.push(item.slice(1))
    })
    return { categoryData, values }
  }

  /**
   * 绘制坐标轴
   */
  drawAxis () {
    const { chartZone } = this.options
    this.ctx.strokeWidth = 4
    this.ctx.strokeStyle = '#353535'
    this.ctx.moveTo(chartZone[0], chartZone[1])
    this.ctx.lineTo(chartZone[0], chartZone[3]) // 画y轴
    this.ctx.lineTo(chartZone[2], chartZone[3]) // 画x轴
    this.ctx.stroke()
  }

  /**
   * 绘制y轴坐标
   */
  drawYLabels () {
    const { chartZone, yAxisLabel } = this.options
    const labels = yAxisLabel
    const yLength = chartZone[3] - chartZone[1]
    const gap = yLength / (labels.length - 1) // 坐标点之间的间隔

    labels.forEach((label, index) => {
    // 绘制坐标文字
      const height = chartZone[3] - index * gap
      this.ctx.textAlign = 'right'
      this.ctx.fillText(label, chartZone[0] - 14, height + 3)
      // 绘制小间隔
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#353535'
      this.ctx.moveTo(chartZone[0] - 10, height)
      this.ctx.lineTo(chartZone[0], height)
      this.ctx.stroke()
      // 绘制辅助线
      if (index === 0) return // 排除x轴
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#eaeaea'
      this.ctx.moveTo(chartZone[0], height)
      this.ctx.lineTo(chartZone[2], height)
      this.ctx.stroke()
    })
  }

  /**
   * 绘制x轴坐标
   */
  drawXLabels () {
    const { xAxisLabel, chartZone } = this.options
    const labels = xAxisLabel
    const xLength = chartZone[2] - chartZone[0]
    const gap = xLength / labels.length // 坐标点之间的间隔

    labels.forEach((label, index) => {
      const width = chartZone[0] + index * gap
      if (index % 4 === 0) {
        this.ctx.strokeStyle = '#eaeaea'
        this.ctx.font = '18px'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(label, width, chartZone[3] + 16)
      }
      // 绘制小间隔
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#353535'
      this.ctx.moveTo(width, chartZone[3])
      this.ctx.lineTo(width, chartZone[3] + 5)
      this.ctx.stroke()
    })
  }

  /**
   * 绘制数据
   */
  drawData () {
    const { data, chartZone, xAxisLabel } = this.options
    const xLength = chartZone[2] - chartZone[0]
    const gap = xLength / xAxisLabel.length
    const openingPriceCoords = []
    const closingPriceCoords = []

    data.forEach((item, index) => {
      // 获取绘图颜色
      const color = this.getColor(item)
      this.ctx.strokeStyle = this.ctx.fillStyle = color
      // 计算绘制中心点x坐标
      const activeX = chartZone[0] + index * gap
      // 绘制最高最低线;
      this.ctx.beginPath()
      this.ctx.moveTo(activeX, this.transYValueToYCoord(item[2]))
      this.ctx.lineTo(activeX, this.transYValueToYCoord(item[3]))
      this.ctx.closePath()
      this.ctx.stroke()

      const openingPrice = this.transYValueToYCoord(item[0]) // 开盘价
      const closingPrice = this.transYValueToYCoord(item[1]) // 收盘价
      openingPriceCoords.push([activeX, openingPrice])
      closingPriceCoords.push([activeX, closingPrice])

      // 绘制开盘收盘矩形
      if (item[0] >= item[1]) {
        this.ctx.fillRect(activeX - 5, openingPrice, 10, closingPrice - openingPrice)
      } else {
        this.ctx.fillRect(activeX - 5, closingPrice, 10, openingPrice - closingPrice)
      }
    })

    // 绘制曲线图
    // drawCurve(openingPriceCoords, '#f9bb2d') // 开盘价曲线图
    this.drawCurve(closingPriceCoords, 'blue') // 收盘价曲线图
  }

  /**
   * 绘制曲线图
   */
  drawCurve (data, style) {
    let lastPoint = data[0] // 缓存上一条线的终点

    let index = 1
    const step = () => {
      const item = data[index]

      const ctrlPoint = item // 当前数据点为本条线的控制点
      const next = data[index + 1] || item
      // 计算每段曲线终点
      const nextPoint = [(item[0] + next[0]) / 2, (item[1] + next[1]) / 2] // 两个数据点的中点
      const nextPoin2 = [(nextPoint[0] + next[0]) / 2, (nextPoint[1] + next[1]) / 2]

      this.ctx.beginPath()
      this.ctx.moveTo(...lastPoint)
      this.ctx.quadraticCurveTo(
        ...ctrlPoint,
        ...nextPoin2
      )
      this.ctx.strokeStyle = style
      this.ctx.stroke()
      lastPoint = nextPoin2

      if (index < data.length - 1) {
        index++
        requestAnimationFrame(step)
      }
    }

    step()
  }

  /**
   * 根据K线图的数据计算绘图颜色
   */
  getColor (data) {
    return data[0] >= data[1] ? '#1abc9c' : '#DA5961'
  }

  /**
   * 从可视坐标系坐标转换为canvas坐标系坐标
   * 数学公式转换
   */
  transYValueToYCoord (yValue) {
    const { chartZone, yMin, yMax } = this.options
    return chartZone[3] - (chartZone[3] - chartZone[1]) * (yValue - yMin) / (yMax - yMin)
  }

  /**
   * 根据canvas坐标系y坐标获取可视坐标系y坐标
   * 数学公式转换
   */
  transYCoordToYValue (yCoord) {
    const { chartZone, yMin, yMax } = this.options
    return ((yMax - yMin) * (chartZone[3] - yCoord) / (chartZone[3] - chartZone[1]) + yMin).toFixed(2)
  }

  /**
   * 根据canvas坐标系x坐标获取可视坐标系x坐标
   * 数学公式转换
   */
  transXCoordToXValue (xCoord) {
    const { chartZone, xAxisLabel } = this.options
    const labels = xAxisLabel
    const xLength = chartZone[2] - chartZone[0]
    const gap = xLength / labels.length // 坐标点之间的间隔
    const index = Math.round((xCoord - chartZone[0]) / gap)
    return {
      index,
      value: labels[index]
    }
  }

  render () {
    this.drawAxis()
    this.drawYLabels()
    this.drawXLabels()
    this.drawData()
  }
}

export default ColumnChart
