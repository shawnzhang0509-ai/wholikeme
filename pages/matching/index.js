Page({
  data: { lines: ['正在寻找与你有关的人……', '正在匹配学校……', '正在寻找可能认识你的人……', '正在确认关系线索……', '找到了。'] },

  onLoad() {
    const profile = getApp().globalData.profile
    if (!profile || !profile.resolvedSchoolId) {
      wx.showToast({ title: '请先确认学校', icon: 'none' })
      setTimeout(() => wx.redirectTo({ url: '/pages/profile/index' }), 700)
    }
  },

  done() {
    const profile = getApp().globalData.profile
    if (!profile || !profile.resolvedSchoolId) {
      wx.redirectTo({ url: '/pages/profile/index' })
      return
    }
    setTimeout(() => wx.redirectTo({ url: '/pages/results/index' }), 260)
  }
})
