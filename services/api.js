const { match } = require('../mock/people')

function request(options) {
  const app = getApp()
  const baseUrl = (app && app.globalData && app.globalData.apiBaseUrl) || ''
  return new Promise((resolve, reject) => {
    if (!baseUrl || baseUrl.includes('your-vercel-app')) {
      resolve(match(options.data && options.data.profile))
      return
    }
    wx.request({
      url: `${baseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: 6000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data)
        else reject(new Error(`API ${res.statusCode}`))
      },
      fail() {
        resolve(match(options.data && options.data.profile))
      }
    })
  })
}

function getMatch(profile) {
  return request({ url: '/api/match', method: 'POST', data: { profile } })
}

module.exports = { getMatch }
