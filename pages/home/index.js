Page({
  goCrush() {
    wx.navigateTo({ url: '/pages/crush/index' })
  },
  onShareAppMessage() {
    return { title: '谁喜欢过我？', path: '/pages/home/index' }
  }
})
