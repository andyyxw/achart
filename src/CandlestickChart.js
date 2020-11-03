/**
 * 蜡烛图
 */
import makeHighRes from './utils/makeHighRes.js'

class CandlestickChart {
  constructor (config) {
    this.config = config
    this.makeUILayer()
    this.ctx = makeHighRes(document.getElementById(config.id))
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
   * 判断是否在可视坐标系内部
   */
  isPointIn (x, y) {
    const { chartZone } = this.options
    return x >= chartZone[0] && x <= chartZone[2] && y >= chartZone[1] && y <= chartZone[3]
  }

  // 绘制UI
  drawUI (x, y, flag) {
    this.clearArc()
    if (flag) {
      this.drawMouseBlock(x, y)
    }
    // 判断是否在坐标系内部
    if (!this.isPointIn(x, y)) return
    this.drawRealTimeData(x, y)
  }

  // 创建圆滑块
  drawMouseBlock (x, y) {
    this.uiCtx.beginPath()
    this.uiCtx.fillStyle = 'rgba(193,193,193,0.5)'
    this.uiCtx.arc(x, y, 20, 0, Math.PI * 2)
    this.uiCtx.fill()
  }

  // 绘制实时数据
  drawRealTimeData (x, y) {
    const { chartZone, data } = this.options

    // 绘制十字线
    this.uiCtx.beginPath()
    this.uiCtx.strokeStyle = '#008BE5'
    this.uiCtx.moveTo(x, chartZone[1])
    this.uiCtx.lineTo(x, chartZone[3])
    this.uiCtx.moveTo(chartZone[1], y)
    this.uiCtx.lineTo(chartZone[2], y)
    this.uiCtx.stroke()

    // 绘制实时数据
    this.uiCtx.fillStyle = '#EDF2FD'
    this.uiCtx.fillRect(chartZone[0] - 46, y - 9, 46, 18)
    this.uiCtx.fillRect(x - 27, chartZone[3], 54, 18)
    this.uiCtx.font = 'bold 10px sans-serif'
    this.uiCtx.fillStyle = '#333333'
    this.uiCtx.textAlign = 'right'
    this.uiCtx.fillText(this.transYCoordToYValue(y) || '', chartZone[0] - 3, y + 3) // y轴实时数据
    this.uiCtx.textAlign = 'center'
    const curData = this.transXCoordToXValue(x)
    this.uiCtx.fillText(curData.value || '', x, chartZone[3] + 12) // x轴实时数据

    const item = data[curData.index]
    // 绘制顶部文字
    let xCoord = chartZone[0]
    const height = chartZone[1] - 20
    const color = this.getColor(item)
    this.uiCtx.font = 'bold 14px sans-serif'
    this.uiCtx.fillStyle = '#000000'
    this.uiCtx.textAlign = 'start'
    this.uiCtx.fillText(curData.value, xCoord += 100, height)
    xCoord += 30
    const texts = ['高', '开', '低', '收'];
    [item[3], item[0], item[2], item[1]].forEach((it, index) => {
      this.uiCtx.fillStyle = '#889198'
      this.uiCtx.fillText(texts[index], xCoord += 70, height)
      this.uiCtx.fillStyle = color
      this.uiCtx.fillText(it, xCoord += 20, height)
    })
  }

  clearArc () {
    this.uiCtx.clearRect(0, 0, this.ui.width, this.ui.height)
  }

  /**
   * 设置UI层
   */
  makeUILayer () {
    const $id = document.getElementById(this.config.id)
    const width = $id.width
    const height = $id.height
    const styles = getComputedStyle($id, null)
    const ui = document.createElement('canvas')
    ui.id = 'ui-layer'
    ui.style.zIndex = Number(styles.zIndex) + 1
    ui.width = width
    ui.height = height
    document.body.insertBefore(ui, $id)
    this.ui = ui
    this.uiCtx = makeHighRes(ui)

    ui.addEventListener('mousedown', (event) => {
      this.drawUI(event.clientX, event.clientY, true)

      const up = (e) => {
        this.drawUI(e.clientX, e.clientY)
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      const move = (e) => {
        this.drawUI(e.clientX, e.clientY, true)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })
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

export default CandlestickChart
