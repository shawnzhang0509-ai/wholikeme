/**
 * I-liked-record service — pages use this module only.
 * No /api calls; local mock + wx storage fallback.
 */

const recordSchools = require('../mock/recordSchools')
const likedMock = require('../mock/likedRecordMock')

const STORAGE_KEY = 'iliked_store_v1'

function readStore() {
  const app = getApp()
  if (!app.globalData.ilikedStore) {
    app.globalData.ilikedStore = wx.getStorageSync(STORAGE_KEY) || {
      anchor: null,
      records: [],
      pendingSchools: []
    }
  }
  return app.globalData.ilikedStore
}

function writeStore(store) {
  const app = getApp()
  app.globalData.ilikedStore = store
  wx.setStorageSync(STORAGE_KEY, store)
}

function searchSchoolCandidates(raw) {
  const store = readStore()
  return recordSchools.searchCandidates(raw, store.pendingSchools)
}

function createPendingSchool(rawName) {
  const store = readStore()
  const school = recordSchools.createPendingSchool(rawName, store.pendingSchools)
  writeStore(store)
  return school
}

function getSchoolById(id) {
  const store = readStore()
  return recordSchools.schoolById(id, store.pendingSchools)
}

function candidateLabel(school) {
  return recordSchools.candidateLabel(school)
}

function saveMyAnchor(payload) {
  const store = readStore()
  const anchor = likedMock.createAnchor(payload)
  store.anchor = anchor
  writeStore(store)
  return anchor
}

function getMyAnchor() {
  return readStore().anchor
}

function addLikedRecord(payload) {
  const store = readStore()
  if (!store.anchor) throw new Error('anchor_required')
  const record = likedMock.createRecord(store.anchor, payload)
  store.records = [record, ...store.records]
  writeStore(store)
  return record
}

function listMyRecords() {
  return likedMock.listVisibleRecords(readStore())
}

/** Local DEMO: 800ms delay then apply Ada lit_pending_identity rule */
function demoCheckLit() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const store = readStore()
      const next = likedMock.applyDemoCheckLit(store)
      writeStore(next)
      resolve(likedMock.listVisibleRecords(next))
    }, 800)
  })
}

function confirmLitIdentity(recordId, decision) {
  const store = readStore()
  const next = likedMock.confirmLitIdentity(store, recordId, decision)
  writeStore(next)
  return likedMock.listVisibleRecords(next)
}

function removeRecord(recordId) {
  const store = readStore()
  const next = likedMock.removeRecord(store, recordId)
  writeStore(next)
  return likedMock.listVisibleRecords(next)
}

module.exports = {
  searchSchoolCandidates,
  createPendingSchool,
  getSchoolById,
  candidateLabel,
  saveMyAnchor,
  getMyAnchor,
  addLikedRecord,
  listMyRecords,
  demoCheckLit,
  confirmLitIdentity,
  removeRecord
}
