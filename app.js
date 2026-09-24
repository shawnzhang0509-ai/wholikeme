App({
  globalData: {
    profile: null,
    match: null,
    confirmedPeople: [],
    dismissedPeople: [],
    customSchools: [],
    apiBaseUrl: 'https://your-vercel-app.vercel.app'
  },

  onLaunch() {
    const cached = wx.getStorageSync('profile')
    const customSchools = wx.getStorageSync('customSchools') || []
    this.globalData.customSchools = customSchools
    if (cached) this.globalData.profile = cached
  },

  setProfile(profile) {
    this.globalData.profile = profile
    wx.setStorageSync('profile', profile)
  },

  addCustomSchool(school) {
    const list = [...this.globalData.customSchools.filter((s) => s.id !== school.id), school]
    this.globalData.customSchools = list
    wx.setStorageSync('customSchools', list)
  }
})
