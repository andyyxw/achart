/**
 * 曲线图
 */
import makeHighRes from './utils/makeHighRes.js'
import GetRandomColor from './utils/getRandomColor.js'

class CurveChart {
  constructor (config) {
    this.config = config
    this.handleData()
    this.ctx = makeHighRes(document.getElementById(config.id))
  }

  /**
   * 处理数据
   */
  handleData () {
    const { id, data, position } = this.config
    const posArr = position.split('*')
    const { width, height } = document.getElementById(id)

    const chartZone = [50, 50, width - 50, height - 50] // 坐标系的区域（分别是左上角和右下角两点的坐标）
    const xAxisLabel = []
    let max = 0
    const types = []
    const datas = []

    data.forEach((item) => {
      const xLabel = item[posArr[0]]
      const value = item[posArr[1]]
      const type = item.type
      if (!types.includes(type)) {
        types.push(type)
      }
      const payload = { type, value }
      const xLabelIndex = xAxisLabel.indexOf(xLabel)
      if (xAxisLabel.includes(xLabel)) {
        datas[xLabelIndex].values.push(payload)
      } else {
        xAxisLabel.push(xLabel)
        datas.push({
          label: xLabel,
          values: [payload]
        })
      }
      max = Math.max(max, value)
    })

    const yGap = Math.round(max / (5 - 1) / 10) * 10
    const yAxisLabel = [...Array(5)].map((_, index) => (index * yGap))
    this.options = {
      datas,
      chartZone,
      xAxisLabel, // y轴坐标点
      yAxisLabel, // x轴坐标点
      yMax: yAxisLabel[yAxisLabel.length - 1],
      yMin: yAxisLabel[0],
      colors: new GetRandomColor(Math.max(1, types.filter(Boolean).length)),
      types
    }
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
    const gap = (chartZone[2] - chartZone[0]) / xAxisLabel.length // x轴坐标点间隔单元

    xAxisLabel.forEach((label, index) => {
      const activeX = chartZone[0] + (index + 1) * gap
      if ([0, Math.floor(xAxisLabel.length / 2), xAxisLabel.length - 1].includes(index)) {
        // 绘制文字
        this.ctx.strokeStyle = '#eaeaea'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(label, activeX, chartZone[3] + 16)
        // 绘制小间隔
        this.ctx.beginPath()
        this.ctx.strokeStyle = '#353535'
        this.ctx.moveTo(activeX, chartZone[3])
        this.ctx.lineTo(activeX, chartZone[3] + 5)
        this.ctx.stroke()
      }
    })
  }

  /**
   * 绘制数据
   */
  drawData () {
    const { datas, chartZone, xAxisLabel, colors, types } = this.options
    const gap = (chartZone[2] - chartZone[0]) / xAxisLabel.length // x轴坐标点间隔单元
    let lastPoints = [] // 缓存上一条线的终点

    let index = 0
    const step = () => {
      const activeX = chartZone[0] + (index + 1) * gap
      const item = datas[index]
      const nextItem = datas[index + 1] || item
      const nextX = chartZone[0] + Math.min(datas.length, index + 1 + 1) * gap
      const endPoints = []
      item.values.forEach((it, index2) => {
        const y = this.transYValueToYCoord(it.value)
        const nextY = this.transYValueToYCoord(nextItem.values[index2].value)
        const ctrlPoint = [activeX, y] // 当前数据点为本条线的控制点
        // 计算每段曲线终点
        let endPoint = [(activeX + nextX) / 2, (y + nextY) / 2] // 取两个数据点的中点
        endPoint = [(endPoint[0] + nextX) / 2, (endPoint[1] + nextY) / 2] // 调整终点 提高精确度
        const startPoint = lastPoints[index2] || endPoint

        this.ctx.beginPath()
        this.ctx.strokeStyle = colors[item.values.length ? types.indexOf(it.type) : 0]
        this.ctx.moveTo(...startPoint)
        this.ctx.quadraticCurveTo(
          ...ctrlPoint,
          ...endPoint
        )
        this.ctx.stroke()
        endPoints.push(endPoint)
      })
      lastPoints = endPoints

      if (index < datas.length - 1) {
        index++
        requestAnimationFrame(step)
      }
    }

    step()
  }

  /**
   * 从可视坐标系坐标转换为canvas坐标系坐标
   * 数学公式转换
   */
  transYValueToYCoord (yValue) {
    const { chartZone, yMin, yMax } = this.options
    return chartZone[3] - (chartZone[3] - chartZone[1]) * (yValue - yMin) / (yMax - yMin)
  }

  render () {
    this.drawAxis()
    this.drawYLabels()
    this.drawXLabels()
    this.drawData()
  }
}

export default CurveChart
