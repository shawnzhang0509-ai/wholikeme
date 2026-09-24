const demoProfile = { name: '张三', school: 'Auckland Grammar School', enrollmentYear: 2010, city: 'Auckland' }

const people = [
  { id: 'p1', name: '张三', school: 'Auckland Grammar School', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能与你同班', type: 'liked', revealLevel: 1 },
  { id: 'p2', name: 'Li Wei', school: 'Auckland Grammar School', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能与你同校同届', type: 'classmate', revealLevel: 2 },
  { id: 'p3', name: 'Momo', school: 'Auckland Grammar School', enrollmentYear: 2012, city: 'Auckland', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 },
  { id: 'p4', name: '陈晨', school: 'Auckland Grammar School', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能与你同班', type: 'classmate', revealLevel: 3 },
  { id: 'p5', name: 'Alex', school: 'Auckland Grammar School', enrollmentYear: 2011, city: 'Auckland', relationHint: '可能与你同校', type: 'friend', revealLevel: 2 },
  { id: 'p6', name: 'Sophie', school: 'Auckland Grammar School', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能与你同届', type: 'classmate', revealLevel: 3 },
  { id: 'p7', name: 'Jordan', school: 'Mount Albert Grammar', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能同城同届', type: 'friend', revealLevel: 4 },
  { id: 'p8', name: 'Grace', school: 'Auckland Grammar School', enrollmentYear: 2009, city: 'Auckland', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 },
  { id: 'u1', name: 'Unknown #01', school: null, enrollmentYear: null, city: 'Auckland', relationHint: '身份暂时无法确认', type: 'unknown', revealLevel: 5 },
  { id: 'u2', name: 'Unknown #02', school: 'Auckland Grammar School', enrollmentYear: null, city: null, relationHint: '身份暂时无法确认', type: 'unknown', revealLevel: 5 },
  { id: 'p9', name: 'Nora', school: 'Epsom Girls Grammar', enrollmentYear: 2010, city: 'Auckland', relationHint: '可能同城同届', type: 'classmate', revealLevel: 4 },
  { id: 'p10', name: 'Kevin', school: 'Auckland Grammar School', enrollmentYear: 2013, city: 'Auckland', relationHint: '可能与你同校', type: 'schoolmate', revealLevel: 2 }
]

const stages = [
  { key: 'found', title: '我们发现 12 个可能与你有关的人。', detail: '其中 3 个与情感关系高度相关。' },
  { key: 'school', title: '其中 5 人与你来自同一所学校。', detail: '同一学校会提高关系可信度。' },
  { key: 'year', title: '其中 2 人与你同一年入学。', detail: '同届意味着更可能真正认识。' },
  { key: 'class', title: '有 1 个人与你曾经同班。', detail: '这个信号最接近答案。' },
  { key: 'heart', title: '❤️ 有 1 个人与你的关系高度匹配。', detail: '暂不显示姓名，先保留一点悬念。' }
]

function match(profile = demoProfile) {
  return {
    demo: true,
    query: profile,
    total: 12,
    summary: { liked: 3, classmates: 5, friends: 2, unknown: 2 },
    people,
    stages
  }
}

module.exports = { demoProfile, people, stages, match }
