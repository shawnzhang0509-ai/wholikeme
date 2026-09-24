App({
  globalData: {
    profile: null,
    match: null,
    confirmedPeople: [],
    dismissedPeople: [],
    ilikedStore: null,
    apiBaseUrl: 'https://your-vercel-app.vercel.app'
  },

  onLaunch() {
    const cached = wx.getStorageSync('profile')
    if (cached) this.globalData.profile = cached
    const iliked = wx.getStorageSync('iliked_store_v1')
    if (iliked) this.globalData.ilikedStore = iliked
  },

  setProfile(profile) {
    this.globalData.profile = profile
    wx.setStorageSync('profile', profile)
  }
})
