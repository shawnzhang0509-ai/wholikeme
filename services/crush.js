/**
 * Mutual-crush service — pages must use this module only (no direct mock imports).
 * Experiment branch: always falls back to local mock; does not call /api.
 */

const mockSchools = require('../mock/crushSchools')
const crushMock = require('../mock/crushMock')

function pendingSchools() {
  const app = getApp()
  if (!app.globalData.crushPendingSchools) app.globalData.crushPendingSchools = []
  return app.globalData.crushPendingSchools
}

function searchSchoolCandidates(raw) {
  return mockSchools.searchCandidates(raw, pendingSchools())
}

function createPendingSchool(rawName) {
  return mockSchools.createPendingSchool(rawName, pendingSchools())
}

function getSchoolById(id) {
  return mockSchools.schoolById(id, pendingSchools())
}

function candidateLabel(school) {
  return mockSchools.candidateLabel(school)
}

/** @returns {Promise<object>} */
function submitCrushes(payload) {
  return new Promise((resolve) => {
    const result = crushMock.submitCrushes(payload, pendingSchools())
    const app = getApp()
    app.globalData.lastCrushSubmission = result
    wx.setStorageSync('lastCrushSubmission', result)
    resolve(result)
  })
}

module.exports = {
  searchSchoolCandidates,
  createPendingSchool,
  getSchoolById,
  candidateLabel,
  submitCrushes
}
