/**
 * I-liked-record experiment — pure mock logic (no wx).
 *
 * DEMO RULE: targetNameRaw === "Ada" (trim, case-insensitive) + complete UserAnchor
 * → after demoCheckLit delay, status becomes lit_pending_identity with identity fragments.
 * Confirm → lit + mutual_crush; reject → unlit + needs_identity (no rejection copy).
 *
 * Boundaries: no notify targets; no search-by-name; no public lists; one-sided never shown.
 */

const DEMO_LIT_NAME = 'Ada'

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function normalizeName(name) {
  return String(name || '').trim()
}

function anchorComplete(anchor) {
  return !!(anchor && anchor.name && anchor.schoolId && anchor.enrollmentYear)
}

// UserAnchor { id,name,schoolId,enrollmentYear,city,createdAt }
function createAnchor(payload) {
  const now = new Date().toISOString()
  return {
    id: uid('anchor'),
    name: normalizeName(payload.name),
    schoolId: payload.schoolId,
    enrollmentYear: String(payload.enrollmentYear || '').trim(),
    city: payload.city ? String(payload.city).trim() : null,
    createdAt: now
  }
}

// LikedRecord { id,ownerUserId,targetNameRaw,targetSchoolId,targetEnrollmentYear,status,createdAt,... }
function createRecord(anchor, payload) {
  const now = new Date().toISOString()
  return {
    id: uid('record'),
    ownerUserId: anchor.id,
    targetNameRaw: normalizeName(payload.targetName),
    targetSchoolId: payload.targetSchoolId || null,
    targetEnrollmentYear: payload.targetEnrollmentYear
      ? String(payload.targetEnrollmentYear).trim()
      : null,
    status: 'unlit',
    createdAt: now,
    demoReveal: null
  }
}

function demoIdentityFragments(record, anchor) {
  return {
    name: DEMO_LIT_NAME,
    schoolFragment: '杭州 · 实验中学',
    yearFragment: record.targetEnrollmentYear
      ? `${record.targetEnrollmentYear} 级`
      : anchor.enrollmentYear
        ? `${anchor.enrollmentYear} 级`
        : '年份碎片 · 待确认'
  }
}

function applyDemoCheckLit(store) {
  if (!anchorComplete(store.anchor)) return store
  const records = store.records.map((r) => {
    if (r.status !== 'unlit' && r.status !== 'needs_identity') return r
    const isAda = normalizeName(r.targetNameRaw).toLowerCase() === DEMO_LIT_NAME.toLowerCase()
    if (!isAda) return r
    return {
      ...r,
      status: 'lit_pending_identity',
      demoReveal: demoIdentityFragments(r, store.anchor)
    }
  })
  return { ...store, records }
}

function confirmLitIdentity(store, recordId, decision) {
  const records = store.records.map((r) => {
    if (r.id !== recordId) return r
    if (r.status !== 'lit_pending_identity') return r
    if (decision === 'confirm') {
      return {
        ...r,
        status: 'lit',
        signal: 'mutual_crush',
        demoReveal: r.demoReveal
      }
    }
    return {
      ...r,
      status: 'unlit',
      needsIdentity: true,
      demoReveal: null,
      signal: null
    }
  })
  return { ...store, records }
}

function removeRecord(store, recordId) {
  return {
    ...store,
    records: store.records
      .map((r) => (r.id === recordId ? { ...r, status: 'deleted' } : r))
      .filter((r) => r.status !== 'deleted')
  }
}

function listVisibleRecords(store) {
  return (store.records || []).filter((r) => r.status !== 'deleted')
}

module.exports = {
  DEMO_LIT_NAME,
  createAnchor,
  createRecord,
  applyDemoCheckLit,
  confirmLitIdentity,
  removeRecord,
  listVisibleRecords,
  anchorComplete
}
