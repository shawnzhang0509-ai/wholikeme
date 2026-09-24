const {
  listMyRecords,
  demoCheckLit,
  confirmLitIdentity,
  removeRecord
} = require('../../services/likedRecord')

Page({
  data: {
    records: [],
    checking: false
  },

  onShow() {
    this.refreshRecords()
    this.setData({ checking: true })
    demoCheckLit().then((records) => {
      this.setData({ records, checking: false })
    })
  },

  refreshRecords() {
    this.setData({ records: listMyRecords() })
  },

  goRecord() {
    wx.navigateTo({ url: '/pages/record/index' })
  },

  onConfirmIdentity(e) {
    const id = e.currentTarget.dataset.id
    const records = confirmLitIdentity(id, 'confirm')
    this.setData({ records })
  },

  onRejectIdentity(e) {
    const id = e.currentTarget.dataset.id
    const records = confirmLitIdentity(id, 'reject')
    this.setData({ records })
    wx.showToast({ title: '已回到未点亮', icon: 'none' })
  },

  onRemove(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除这条记录？',
      content: '演示数据将从本地移除，不会通知任何人。',
      confirmText: '删除',
      success: (res) => {
        if (!res.confirm) return
        const records = removeRecord(id)
        this.setData({ records })
      }
    })
  }
})
