Page({
  data: { form: { name: '', school: '', enrollmentYear: '', city: '' } },
  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },
  submit() {
    const app = getApp()
    const profile = {
      name: this.data.form.name.trim(),
      school: this.data.form.school.trim(),
      enrollmentYear: this.data.form.enrollmentYear.trim(),
      city: this.data.form.city.trim()
    }
    if (!profile.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' })
      return
    }
    app.setProfile(profile)
    wx.navigateTo({ url: '/pages/matching/index' })
  }
})
