Page({
  goRecord() {
    wx.navigateTo({ url: '/pages/record/index' })
  },
  goRecords() {
    wx.navigateTo({ url: '/pages/records/index' })
  },
  onShareAppMessage() {
    return { title: '我喜欢过谁？', path: '/pages/home/index' }
  }
})
