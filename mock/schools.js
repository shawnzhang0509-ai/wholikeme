const { findProvince, findPrefectureCity } = require('./regions')

/** Canonical schools; many share display names across cities. */
const schools = [
  { id: 'sch_hz_sy', name: '实验中学', city: '杭州', province: '浙江', prefectureCity: '杭州市', provinceCode: 'zj', cityCode: 'hz' },
  { id: 'sch_nj_sy', name: '实验中学', city: '南京', province: '江苏', prefectureCity: '南京市', provinceCode: 'js', cityCode: 'nj' },
  { id: 'sch_cd_sy', name: '实验中学', city: '成都', province: '四川', prefectureCity: '成都市', provinceCode: 'sc', cityCode: 'cd' },
  { id: 'sch_hz_yz', name: '第一中学', city: '杭州', province: '浙江', prefectureCity: '杭州市', provinceCode: 'zj', cityCode: 'hz' },
  { id: 'sch_nb_yz', name: '第一中学', city: '宁波', province: '浙江', prefectureCity: '宁波市', provinceCode: 'zj', cityCode: 'nb' },
  { id: 'sch_nj_yz', name: '第一中学', city: '南京', province: '江苏', prefectureCity: '南京市', provinceCode: 'js', cityCode: 'nj' },
  { id: 'sch_sh_wgy', name: '外国语学校', city: '上海', province: '上海', prefectureCity: '上海市', provinceCode: 'sh', cityCode: 'sh' },
  { id: 'sch_sz_wgy', name: '外国语学校', city: '苏州', province: '江苏', prefectureCity: '苏州市', provinceCode: 'js', cityCode: 'sz-js' },
  { id: 'sch_gz_wgy', name: '外国语学校', city: '广州', province: '广东', prefectureCity: '广州市', provinceCode: 'gd', cityCode: 'gz' },
  { id: 'sch_hz_ag', name: '杭州高级中学', city: '杭州', province: '浙江', prefectureCity: '杭州市', provinceCode: 'zj', cityCode: 'hz' }
]

/** alias -> schoolId (multiple rows per alias when names collide nationally). */
const schoolAliases = [
  { alias: '实验中学', schoolId: 'sch_hz_sy' },
  { alias: '实验中学', schoolId: 'sch_nj_sy' },
  { alias: '实验中学', schoolId: 'sch_cd_sy' },
  { alias: '实验', schoolId: 'sch_hz_sy' },
  { alias: '实验', schoolId: 'sch_nj_sy' },
  { alias: '杭州实验', schoolId: 'sch_hz_sy' },
  { alias: '一中', schoolId: 'sch_hz_yz' },
  { alias: '一中', schoolId: 'sch_nb_yz' },
  { alias: '一中', schoolId: 'sch_nj_yz' },
  { alias: '第一中学', schoolId: 'sch_hz_yz' },
  { alias: '第一中学', schoolId: 'sch_nb_yz' },
  { alias: '外国语学校', schoolId: 'sch_sh_wgy' },
  { alias: '外国语学校', schoolId: 'sch_sz_wgy' },
  { alias: '外国语学校', schoolId: 'sch_gz_wgy' },
  { alias: '杭高', schoolId: 'sch_hz_ag' },
  { alias: '杭州高级中学', schoolId: 'sch_hz_ag' }
]

function normalizeText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
}

function schoolById(id, extra = []) {
  return [...schools, ...extra].find((s) => s.id === id) || null
}

function candidateLabel(school) {
  return `${school.province} · ${school.city} · ${school.name}`
}

function searchSchoolCandidates(raw, extraSchools = []) {
  const q = normalizeText(raw)
  if (!q) return { candidates: [], autoSelected: null }

  const catalog = [...schools, ...extraSchools]
  const idSet = new Set()

  schoolAliases.forEach((row) => {
    if (!normalizeText(row.alias).includes(q) && !q.includes(normalizeText(row.alias))) return
    idSet.add(row.schoolId)
  })

  catalog.forEach((school) => {
    const name = normalizeText(school.name)
    if (name.includes(q) || q.includes(name)) idSet.add(school.id)
  })

  const candidates = [...idSet]
    .map((id) => schoolById(id, extraSchools))
    .filter(Boolean)
    .sort((a, b) => candidateLabel(a).localeCompare(candidateLabel(b), 'zh-CN'))

  const autoSelected = candidates.length === 1 ? candidates[0] : null
  return { candidates, autoSelected }
}

function createSchoolFromRaw({ rawName, provinceCode, cityCode, districtText }, extraSchools = []) {
  const province = findProvince(provinceCode)
  const prefecture = findPrefectureCity(cityCode)
  const name = String(rawName || '').trim()
  if (!name || !province || !prefecture) return null

  const school = {
    id: `sch_custom_${Date.now()}`,
    name,
    city: prefecture.name.replace(/市$/, ''),
    province: province.name,
    prefectureCity: prefecture.name,
    provinceCode,
    cityCode,
    districtText: String(districtText || '').trim() || null,
    isCustom: true
  }
  extraSchools.push(school)
  return school
}

module.exports = {
  schools,
  schoolAliases,
  normalizeText,
  schoolById,
  candidateLabel,
  searchSchoolCandidates,
  createSchoolFromRaw
}
