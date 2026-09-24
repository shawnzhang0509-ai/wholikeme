Page({
  data: { target: null, stages: [], stageIndex: 0 },
  onLoad() {
    const app = getApp()
    const match = app.globalData.match || { people: [], stages: [] }
    const confirmed = app.globalData.confirmedPeople || []
    const target = confirmed.find((p) => p.type === 'liked') || match.people.find((p) => p.type === 'liked') || match.people[0]
    this.setData({ target, stages: match.stages.length ? match.stages : [{ title: '有 1 个人与你的关系高度匹配。', detail: '先保留一点悬念。' }] })
  },
  next() {
    if (this.data.stageIndex < this.data.stages.length - 1) {
      this.setData({ stageIndex: this.data.stageIndex + 1 })
      return
    }
    wx.showToast({ title: '付费解锁位已预留', icon: 'none' })
  },
  back() { wx.navigateBack({ delta: 1 }) }
})
