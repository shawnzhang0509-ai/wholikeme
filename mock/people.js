const { enrichPerson } = require('../utils/school')

const demoProfile = {
  name: '张三',
  schoolRaw: '杭州实验',
  resolvedSchoolId: 'sch_hz_sy',
  enrollmentYear: '2010',
  districtText: ''
}

const people = [
  { id: 'p1', name: '李然', schoolId: 'sch_hz_sy', enrollmentYear: '2010', relationHint: '可能与你同班', type: 'liked', revealLevel: 1 },
  { id: 'p2', name: '王晨', schoolId: 'sch_hz_sy', enrollmentYear: '2010', relationHint: '可能与你同校同届', type: 'classmate', revealLevel: 2 },
  { id: 'p3', name: '周舟', schoolId: 'sch_hz_sy', enrollmentYear: '2012', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 },
  { id: 'p4', name: '陈晨', schoolId: 'sch_hz_sy', enrollmentYear: '2010', relationHint: '可能与你同班', type: 'classmate', revealLevel: 3 },
  { id: 'p5', name: '赵一', schoolId: 'sch_hz_sy', enrollmentYear: '2011', relationHint: '可能与你同校', type: 'friend', revealLevel: 2 },
  { id: 'p6', name: '孙茜', schoolId: 'sch_hz_sy', enrollmentYear: '2010', relationHint: '可能与你同届', type: 'classmate', revealLevel: 3 },
  { id: 'p7', name: '吴桐', schoolId: 'sch_nj_sy', enrollmentYear: '2010', relationHint: '同名学校 · 南京', type: 'friend', revealLevel: 4 },
  { id: 'p8', name: '林溪', schoolId: 'sch_hz_sy', enrollmentYear: '2009', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 },
  { id: 'u1', name: 'Unknown #01', schoolId: null, enrollmentYear: null, relationHint: '身份暂时无法确认', type: 'unknown', revealLevel: 5 },
  { id: 'u2', name: 'Unknown #02', schoolId: 'sch_hz_sy', enrollmentYear: null, relationHint: '身份暂时无法确认', type: 'unknown', revealLevel: 5 },
  { id: 'p9', name: '何苗', schoolId: 'sch_hz_yz', enrollmentYear: '2010', relationHint: '同城另一所学校', type: 'classmate', revealLevel: 4 },
  { id: 'p10', name: 'Kevin', schoolId: 'sch_hz_sy', enrollmentYear: '2013', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 }
]

const stages = [
  { key: 'found', title: '我们发现 12 个可能与你有关的人。', detail: '其中 3 个与情感关系高度相关。' },
  { key: 'school', title: '其中 5 人与你来自同一所学校。', detail: '同一学校会提高关系可信度。' },
  { key: 'year', title: '其中 2 人与你同一年入学。', detail: '同届意味着更可能真正认识。' },
  { key: 'class', title: '有 1 个人与你曾经同班。', detail: '这个信号最接近答案。' },
  { key: 'heart', title: '❤️ 有 1 个人与你的关系高度匹配。', detail: '暂不显示姓名，先保留一点悬念。' }
]

function match(profile, extraSchools = []) {
  const query = profile || demoProfile
  const schoolId = query.resolvedSchoolId
  const enriched = people.map((p) => enrichPerson(p, extraSchools))
  const sameSchool = enriched.filter((p) => p.schoolId && p.schoolId === schoolId)
  const related = enriched.filter((p) => p.type !== 'unknown' && (p.schoolId === schoolId || p.type === 'friend'))
  const list = schoolId ? [...sameSchool, ...related.filter((p) => !sameSchool.find((s) => s.id === p.id)), ...enriched.filter((p) => p.type === 'unknown')] : []
  const unique = []
  const seen = new Set()
  ;(list.length ? list : enriched).forEach((p) => {
    if (seen.has(p.id)) return
    seen.add(p.id)
    unique.push(p)
  })

  return {
    demo: true,
    query,
    schoolId,
    total: unique.length,
    summary: { liked: 3, classmates: 5, friends: 2, unknown: 2 },
    people: unique.slice(0, 12),
    stages
  }
}

module.exports = { demoProfile, people, stages, match }
