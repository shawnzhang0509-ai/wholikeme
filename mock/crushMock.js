/**
 * Mutual-crush experiment mock — local fallback only.
 *
 * DEMO RULE (do not ship to production as business logic):
 * If any crush target name equals "Ada" (case-insensitive trim),
 * treat Ada as also having written the current user → mutual reveal.
 * Otherwise → not mutual waiting (no rejection, no one-sided exposure).
 *
 * Product boundaries enforced here:
 * - No notification to targets
 * - No search-by-name for "who likes me"
 * - No public crush lists; one-sided crushes never shown to the other party
 */

const { schoolById, createPendingSchool } = require('./crushSchools')

const DEMO_MUTUAL_TARGET_NAME = 'Ada'

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function normalizeName(name) {
  return String(name || '').trim()
}

function normalizeNameKey(name) {
  return normalizeName(name).toLowerCase()
}

/**
 * @param {{ user: object, crushes: array }} payload
 * @param {array} pendingSchools mutable pending school list from app globalData
 */
function submitCrushes(payload, pendingSchools = []) {
  const now = new Date().toISOString()
  const userInput = payload.user || {}
  const school = schoolById(userInput.schoolId, pendingSchools)

  // User { id, name, schoolId, enrollmentYear, city, createdAt }
  const user = {
    id: uid('user'),
    name: normalizeName(userInput.name),
    schoolId: userInput.schoolId,
    enrollmentYear: String(userInput.enrollmentYear || '').trim(),
    city: String(userInput.city || '').trim() || null,
    createdAt: now
  }

  // CrushEntry { id, ownerUserId, targetNameRaw, targetSchoolId, targetEnrollmentYear, status, createdAt }
  const crushEntries = (payload.crushes || []).map((c) => ({
    id: uid('crush'),
    ownerUserId: user.id,
    targetNameRaw: normalizeName(c.targetName),
    targetSchoolId: c.targetSchoolId || null,
    targetEnrollmentYear: c.targetEnrollmentYear ? String(c.targetEnrollmentYear).trim() : null,
    status: 'submitted',
    createdAt: now
  }))

  const hasAda = crushEntries.some(
    (c) => normalizeNameKey(c.targetNameRaw) === DEMO_MUTUAL_TARGET_NAME.toLowerCase()
  )

  if (!hasAda) {
    return {
      demo: true,
      outcome: 'not_mutual',
      user,
      school,
      crushEntries,
      mutualMatch: null,
      revealCard: null,
      copy: {
        waiting: '已放进风里。不会打扰对方。只有对方也写下你，信号才会亮。',
        result: '还没有形成双向。这不等于拒绝，只是答案还没走到这里。'
      }
    }
  }

  // MutualMatch { id, aUserId, bUserId, matchedAt, signals }
  const mutualMatch = {
    id: uid('mutual'),
    aUserId: user.id,
    bUserId: 'user_demo_ada',
    matchedAt: now,
    signals: ['mutual_crush']
  }

  const adaSchool = schoolById('sch_hz_sy', pendingSchools)
  const revealCard = {
    name: DEMO_MUTUAL_TARGET_NAME,
    school: adaSchool ? `${adaSchool.city} · ${adaSchool.name}` : '学校碎片 · 待确认',
    enrollmentYear: user.enrollmentYear || '20xx',
    city: adaSchool ? adaSchool.city : null,
    relationHint: '你们在同一阵风里，互相写下过彼此。',
    signal: 'mutual_crush',
    unlocked: true
  }

  return {
    demo: true,
    outcome: 'mutual',
    user,
    school,
    crushEntries,
    mutualMatch,
    revealCard,
    copy: {
      waiting: '已放进风里。不会打扰对方。只有对方也写下你，信号才会亮。',
      result: '刚刚，有一组名字互相靠近了。'
    }
  }
}

module.exports = { submitCrushes, DEMO_MUTUAL_TARGET_NAME }
