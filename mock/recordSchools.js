/** Minimal school mock for i-liked-record experiment (not a national DB). */

const AMBIGUOUS_KEYWORDS = ['实验', '一中', '二中', '外国语']

const schools = [
  { id: 'sch_hz_sy', name: '实验中学', province: '浙江', city: '杭州', district: null, aliases: ['实验'], status: 'confirmed' },
  { id: 'sch_nj_sy', name: '实验中学', province: '江苏', city: '南京', district: null, aliases: ['实验'], status: 'confirmed' },
  { id: 'sch_hz_yz', name: '第一中学', province: '浙江', city: '杭州', district: null, aliases: ['一中'], status: 'confirmed' },
  { id: 'sch_nj_yz', name: '第一中学', province: '江苏', city: '南京', district: null, aliases: ['一中'], status: 'confirmed' },
  { id: 'sch_hz_ez', name: '第二中学', province: '浙江', city: '杭州', district: null, aliases: ['二中'], status: 'confirmed' },
  { id: 'sch_nb_ez', name: '第二中学', province: '浙江', city: '宁波', district: null, aliases: ['二中'], status: 'confirmed' },
  { id: 'sch_sz_wgy', name: '外国语学校', province: '江苏', city: '苏州', district: null, aliases: ['外国语'], status: 'confirmed' },
  { id: 'sch_gz_wgy', name: '外国语学校', province: '广东', city: '广州', district: null, aliases: ['外国语'], status: 'confirmed' }
]

function isAmbiguousRaw(raw) {
  const text = String(raw || '')
  return AMBIGUOUS_KEYWORDS.some((k) => text.includes(k))
}

function candidateLabel(school) {
  return `${school.province} · ${school.city} · ${school.name}`
}

function searchCandidates(raw, pendingSchools = []) {
  const text = String(raw || '').trim()
  if (!text) return { candidates: [], mode: 'empty' }
  if (!isAmbiguousRaw(text)) return { candidates: [], mode: 'pending' }

  const matched = schools.filter((s) => {
    if (text.includes('实验') && s.name.includes('实验')) return true
    if (text.includes('一中') && s.name.includes('第一')) return true
    if (text.includes('二中') && s.name.includes('第二')) return true
    if (text.includes('外国语') && s.name.includes('外国语')) return true
    return s.aliases.some((a) => text.includes(a))
  })

  const unique = []
  const seen = new Set()
  matched.forEach((s) => {
    if (seen.has(s.id)) return
    seen.add(s.id)
    unique.push(s)
  })
  return { candidates: unique.slice(0, 2), mode: unique.length ? 'disambiguate' : 'pending' }
}

function schoolById(id, pendingSchools = []) {
  return [...schools, ...pendingSchools].find((s) => s.id === id) || null
}

function createPendingSchool(rawName, pendingSchools) {
  const name = String(rawName || '').trim()
  if (!name) return null
  const school = {
    id: `sch_pending_${Date.now()}`,
    name,
    province: null,
    city: null,
    district: null,
    aliases: [],
    status: 'pending'
  }
  pendingSchools.push(school)
  return school
}

module.exports = {
  schools,
  candidateLabel,
  searchCandidates,
  schoolById,
  createPendingSchool
}
