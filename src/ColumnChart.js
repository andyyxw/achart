/**
 * 柱状图
 */
import makeHighRes from './utils/makeHighRes.js'

class ColumnChart {
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
    const values = []
    const xAxisLabel = []
    let max = 0
    data.forEach((item) => {
      const value = item[posArr[1]]
      xAxisLabel.push(item[posArr[0]])
      values.push(value)
      max = Math.max(max, value)
    })

    const yCountGap = Math.round(max / (5 - 1) / 10) * 10
    const yAxisLabel = [...Array(5)].map((_, index) => (index * yCountGap))
    this.options = {
      datas: values,
      chartZone,
      xAxisLabel, // y轴坐标刻度
      yAxisLabel, // x轴坐标刻度
      yMax: yAxisLabel[yAxisLabel.length - 1],
      yMin: yAxisLabel[0]
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
    const gap = (chartZone[2] - chartZone[0]) / (xAxisLabel.length * 2) // x轴坐标点间隔单元

    xAxisLabel.forEach((label, index) => {
      const activeX = chartZone[0] + (1 + index * 2) * gap
      this.ctx.fillStyle = '#353535'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(label, activeX, chartZone[3] + 16)
      // 绘制小间隔
      // this.ctx.beginPath()
      // this.ctx.strokeStyle = '#353535'
      // this.ctx.moveTo(width, chartZone[3])
      // this.ctx.lineTo(width, chartZone[3] + 5)
      // this.ctx.stroke()
    })
  }

  /**
   * 绘制数据
   */
  drawData () {
    const { datas, chartZone, xAxisLabel } = this.options
    const gap = (chartZone[2] - chartZone[0]) / (xAxisLabel.length * 2) // x轴坐标点间隔单元

    datas.forEach((val, index) => {
      // 获取绘图颜色
      const color = '#008DFB'
      this.ctx.fillStyle = color
      // 计算绘制中心点x坐标
      const activeX = chartZone[0] + (1 + index * 2) * gap
      const yCoord = this.transYValueToYCoord(val)

      // 绘制矩形
      this.ctx.fillRect(activeX - gap / 2, yCoord, gap, chartZone[3] - yCoord)

      this.ctx.fillStyle = '#353535'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(val, activeX, yCoord - 6)
    })
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

export default ColumnChart
