const { getMatch } = require('../../services/api')
const { profileSchoolDisplay } = require('../../utils/school')

Page({
  data: { match: null, querySchoolDisplay: '' },

  onLoad() {
    const app = getApp()
    const profile = app.globalData.profile
    if (!profile || !profile.resolvedSchoolId) {
      wx.showToast({ title: '请先确认学校', icon: 'none' })
      setTimeout(() => wx.redirectTo({ url: '/pages/profile/index' }), 700)
      return
    }
    const extra = app.globalData.customSchools || []
    this.setData({ querySchoolDisplay: profileSchoolDisplay(profile, extra) })
    getMatch(profile).then((match) => {
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
