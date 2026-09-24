Page({
  data: {
    phase: 'waiting',
    lines: ['已放进风里。', '不会打扰对方。', '只有对方也写下你，信号才会亮。'],
    outcome: '',
    title: '',
    subtitle: '',
    revealCard: null
  },

  onLoad() {
    const app = getApp()
    const submission = app.globalData.lastCrushSubmission || wx.getStorageSync('lastCrushSubmission')
    if (!submission) {
      wx.redirectTo({ url: '/pages/crush/index' })
      return
    }
    this._submission = submission
  },

  onAnimationDone() {
    const submission = this._submission
    if (!submission) return
    const isMutual = submission.outcome === 'mutual'
    this.setData({
      phase: 'result',
      outcome: submission.outcome,
      title: submission.copy.result,
      subtitle: isMutual ? '双向信号已亮起 · demo 规则：名单含 Ada 时触发' : '答案还没走到这里 · 不等于拒绝',
      revealCard: isMutual ? submission.revealCard : null
    })
  },

  backHome() {
    wx.reLaunch({ url: '/pages/home/index' })
  },

  tryAgain() {
    wx.redirectTo({ url: '/pages/crush/index' })
  }
})
