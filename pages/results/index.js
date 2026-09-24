const { getMatch } = require('../../services/api')
Page({
  data: { match: null },
  onLoad() {
    const app = getApp()
    getMatch(app.globalData.profile).then((match) => {
      app.globalData.match = match
      this.setData({ match })
    })
  },
  openPerson(e) {
    const id = e.detail.person.id
    wx.navigateTo({ url: `/pages/person/index?id=${id}` })
  },
  goRelationship() { wx.navigateTo({ url: '/pages/relationship/index' }) },
  share() { wx.showToast({ title: '分享已预留', icon: 'none' }) },
  onShareAppMessage() { return { title: '我发现了一些可能与我有关的人', path: '/pages/home/index' } }
})
