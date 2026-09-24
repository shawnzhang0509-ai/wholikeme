App({
  globalData: {
    profile: null,
    match: null,
    confirmedPeople: [],
    dismissedPeople: [],
    crushPendingSchools: [],
    lastCrushSubmission: null,
    apiBaseUrl: 'https://your-vercel-app.vercel.app'
  },

  onLaunch() {
    const cached = wx.getStorageSync('profile')
    if (cached) this.globalData.profile = cached
  },

  setProfile(profile) {
    this.globalData.profile = profile
    wx.setStorageSync('profile', profile)
  }
})
