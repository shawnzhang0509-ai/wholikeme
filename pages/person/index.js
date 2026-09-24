Page({
  data: { person: null, confirmed: false },
  onLoad(query) {
    const app = getApp()
    const match = app.globalData.match || { people: [] }
    const person = (match.people || []).find((p) => p.id === query.id)
    this.setData({ person })
  },
  confirm() {
    const app = getApp()
    this.setData({ confirmed: true })
    const list = app.globalData.confirmedPeople.filter((p) => p.id !== this.data.person.id)
    app.globalData.confirmedPeople = [...list, this.data.person]
    wx.showToast({ title: '已确认关系线索', icon: 'none' })
    setTimeout(() => wx.navigateTo({ url: '/pages/relationship/index' }), 500)
  },
  dismiss() {
    const app = getApp()
    app.globalData.dismissedPeople = [...app.globalData.dismissedPeople, this.data.person.id]
    wx.showToast({ title: '已标记不是这个人', icon: 'none' })
    setTimeout(() => wx.navigateBack(), 500)
  }
})
