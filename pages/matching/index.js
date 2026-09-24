Page({
  data: { lines: ['正在寻找与你有关的人……', '正在匹配学校……', '正在寻找可能认识你的人……', '正在确认关系线索……', '找到了。'] },
  done() {
    setTimeout(() => wx.redirectTo({ url: '/pages/results/index' }), 260)
  }
})
