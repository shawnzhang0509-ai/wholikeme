const { enrichPerson } = require('../utils/school')

const demoProfile = {
  name: '张三',
  schoolRaw: '杭州实验',
  resolvedSchoolId: 'sch_hz_sy',
  enrollmentYear: '2010',
  districtText: ''
}

const people = [
  { id: 'p1', name: '李然', schoolId: 'sch_hz_sy', enrollmentYear: '2010', type: 'liked', revealLevel: 1 },
  { id: 'p2', name: '王晨', schoolId: 'sch_hz_sy', enrollmentYear: '2010', type: 'classmate', revealLevel: 2 },
  { id: 'p3', name: '周舟', schoolId: 'sch_hz_sy', enrollmentYear: '2012', type: 'schoolmate', revealLevel: 2 },
  { id: 'p4', name: '陈晨', schoolId: 'sch_hz_sy', enrollmentYear: '2010', type: 'classmate', revealLevel: 3 },
  { id: 'p5', name: '赵一', schoolId: 'sch_hz_sy', enrollmentYear: '2011', type: 'friend', revealLevel: 2 },
  { id: 'p6', name: '孙茜', schoolId: 'sch_hz_sy', enrollmentYear: '2010', type: 'classmate', revealLevel: 3 },
  { id: 'p7', name: '吴桐', schoolId: 'sch_nj_sy', enrollmentYear: '2010', type: 'friend', revealLevel: 4 },
  { id: 'p8', name: '林溪', schoolId: 'sch_hz_sy', enrollmentYear: '2009', type: 'schoolmate', revealLevel: 2 },
  { id: 'u1', name: 'Unknown #01', schoolId: null, enrollmentYear: null, type: 'unknown', revealLevel: 5 },
  { id: 'u2', name: 'Unknown #02', schoolId: 'sch_hz_sy', enrollmentYear: null, type: 'unknown', revealLevel: 5 },
  { id: 'p9', name: '何苗', schoolId: 'sch_hz_yz', enrollmentYear: '2010', type: 'classmate', revealLevel: 4 },
  { id: 'p10', name: 'Kevin', schoolId: 'sch_hz_sy', enrollmentYear: '2013', type: 'schoolmate', revealLevel: 2 }
]

const stages = [
  { key: 'found', title: '我们发现 12 个可能与你有关的人。', detail: '其中 3 个与情感关系高度相关。' },
  { key: 'school', title: '其中 5 人与你来自同一所学校。', detail: '同一学校会提高关系可信度。' },
  { key: 'year', title: '其中 2 人与你同一年入学。', detail: '同届意味着更可能真正认识。' },
  { key: 'class', title: '有 1 个人与你曾经同班。', detail: '这个信号最接近答案。' },
  { key: 'heart', title: '❤️ 有 1 个人与你的关系高度匹配。', detail: '暂不显示姓名，先保留一点悬念。' }
]

function buildRelationHint(person, query) {
  if (person.type === 'unknown') return '身份暂时无法确认'

  const userYear = String(query.enrollmentYear || '').trim()
  const year = String(person.enrollmentYear || '').trim()

  if (userYear && year && userYear === year) {
    if (person.type === 'classmate') return '与你同校同届 · 可能同班'
    if (person.type === 'liked') return '与你同校同届 · 关系信号较强'
    return '与你同校同届'
  }
  if (userYear && year && userYear !== year) {
    return '与你同一所学校 · 不同届'
  }
  return '与你确认了同一所学校'
}

function summarize(list) {
  return list.reduce(
    (acc, p) => {
      if (p.type === 'liked') acc.liked += 1
      else if (p.type === 'classmate' || p.type === 'schoolmate') acc.classmates += 1
      else if (p.type === 'friend') acc.friends += 1
      else if (p.type === 'unknown') acc.unknown += 1
      return acc
    },
    { liked: 0, classmates: 0, friends: 0, unknown: 0 }
  )
}

function match(profile, extraSchools = []) {
  const query = profile || demoProfile
  const schoolId = query.resolvedSchoolId
  const enriched = people.map((p) => enrichPerson(p, extraSchools))

  if (!schoolId) {
    return { demo: true, query, schoolId: null, total: 0, summary: summarize([]), people: [], stages }
  }

  const matched = enriched
    .filter((p) => {
      if (p.type === 'unknown') return p.schoolId == null || p.schoolId === schoolId
      return p.schoolId === schoolId
    })
    .map((p) => ({
      ...p,
      relationHint: buildRelationHint(p, query)
    }))

  const summary = summarize(matched)

  return {
    demo: true,
    query,
    schoolId,
    total: matched.length,
    summary,
    people: matched,
    stages
  }
}

module.exports = { demoProfile, people, stages, match, buildRelationHint }
