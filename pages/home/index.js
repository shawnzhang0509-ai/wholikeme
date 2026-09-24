Page({
  goProfile() { wx.navigateTo({ url: '/pages/profile/index' }) },
  share() {
    wx.showToast({ title: '分享已预留', icon: 'none' })
  },
  onShareAppMessage() {
    return { title: '谁喜欢过我？有些喜欢，从来没有说出口。', path: '/pages/home/index' }
  }
})
