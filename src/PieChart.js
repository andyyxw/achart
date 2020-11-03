/**
 * 饼图
 */
import makeHighRes from './utils/makeHighRes.js'
import GetRandomColor from './utils/getRandomColor.js'

class PieChart {
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
    const xLabel = posArr[0]
    const yLabel = posArr[1]
    const { width, height } = document.getElementById(id)

    const chartZone = [50, 50, width - 50, height - 50] // 坐标系的区域（分别是左上角和右下角两点的坐标）
    const total = data.reduce((acc, cur) => acc + cur[yLabel], 0)
    const datas = data.map(item => ({ ...item, _percent: item[yLabel] / total }))
      .sort((a, b) => b._percent - a._percent)
    this.options = {
      datas,
      chartZone,
      xLabel,
      yLabel,
      colors: new GetRandomColor(Math.max(1, datas.length))
    }
  }

  /**
   * 绘制右边标记
   */
  drawMarks () {
    const { datas, chartZone, colors, xLabel } = this.options
    const radius = (chartZone[3] - chartZone[1]) / 2 * 0.7 // 半径
    const x = chartZone[0] + (chartZone[2] - chartZone[0]) * 0.7
    const y = (chartZone[3] + chartZone[1]) / 2 - (chartZone[3] - chartZone[1]) * 0.7 / 2 + (radius * 2 - 40 * datas.length) / 2
    datas.forEach((item, index) => {
      let curX = x + 5
      this.ctx.fillStyle = colors[index]
      this.ctx.beginPath()
      this.ctx.arc(curX, y + 40 * index, 5, 0, Math.PI * 2)
      this.ctx.fill()
      curX += (5 + 10)
      this.ctx.fillStyle = '#808080'
      this.ctx.font = 'bold 16px sans-serif'
      this.ctx.fillText(`${item[xLabel]}   ${(item._percent * 100).toFixed(2)}%`, curX, y + 40 * index + 5)
    })
  }

  /**
   * 绘制数据
   */
  drawCircular () {
    const { datas, chartZone, colors } = this.options
    const startAngle = Math.PI / 2 * 3

    let lastEngAngle = startAngle // 缓存上一条线的终点
    const circularCenter = [chartZone[0] + (chartZone[2] - chartZone[0]) * 0.7 / 2, (chartZone[3] + chartZone[1]) / 2] // 圆心
    const radius = (chartZone[3] - chartZone[1]) / 2 * 0.7 // 半径
    let index = 0

    const step = () => {
      const item = datas[index]
      const endAngle = lastEngAngle + Math.PI * 2 * item._percent
      this.ctx.fillStyle = colors[index]
      this.ctx.beginPath()
      this.ctx.moveTo(...circularCenter) // 移动到圆心
      this.ctx.arc(...circularCenter, radius, lastEngAngle, endAngle)
      this.ctx.fill()
      lastEngAngle = endAngle

      if (index < datas.length - 1) {
        index++
        requestAnimationFrame(step)
      }
    }

    step()
  }

  render () {
    this.drawMarks()
    this.drawCircular()
  }
}

export default PieChart
