const {
  searchSchoolCandidates,
  createPendingSchool,
  candidateLabel,
  getSchoolById,
  submitCrushes
} = require('../../services/crush')

const MAX_CRUSHES = 3

Page({
  data: {
    form: {
      name: '',
      schoolRaw: '',
      enrollmentYear: '',
      city: ''
    },
    schoolId: '',
    schoolLabel: '',
    candidates: [],
    showCandidates: false,
    crushes: [{ targetName: '', targetSchool: '', targetYear: '' }]
  },

  onUserInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
    if (key === 'schoolRaw') {
      this.setData({ schoolId: '', schoolLabel: '', candidates: [], showCandidates: false })
    }
  },

  onCrushInput(e) {
    const { index, field } = e.currentTarget.dataset
    this.setData({ [`crushes[${index}].${field}`]: e.detail.value })
  },

  addCrush() {
    if (this.data.crushes.length >= MAX_CRUSHES) {
      wx.showToast({ title: '最多 3 个心动名额', icon: 'none' })
      return
    }
    this.setData({ crushes: [...this.data.crushes, { targetName: '', targetSchool: '', targetYear: '' }] })
  },

  removeCrush(e) {
    const index = Number(e.currentTarget.dataset.index)
    const next = this.data.crushes.filter((_, i) => i !== index)
    this.setData({ crushes: next.length ? next : [{ targetName: '', targetSchool: '', targetYear: '' }] })
  },

  confirmSchool() {
    const raw = this.data.form.schoolRaw.trim()
    if (!raw) {
      wx.showToast({ title: '请填写学校', icon: 'none' })
      return
    }
    const { candidates, mode } = searchSchoolCandidates(raw)
    if (mode === 'disambiguate' && candidates.length) {
      this.setData({
        showCandidates: true,
        candidates: candidates.map((c) => ({ id: c.id, label: candidateLabel(c) })),
        schoolId: '',
        schoolLabel: ''
      })
      return
    }
    const pending = createPendingSchool(raw)
    if (!pending) return
    this.setData({
      showCandidates: false,
      candidates: [],
      schoolId: pending.id,
      schoolLabel: `${pending.name}（待确认校）`
    })
  },

  selectSchool(e) {
    const id = e.currentTarget.dataset.id
    const school = getSchoolById(id)
    if (!school) return
    this.setData({
      schoolId: id,
      schoolLabel: candidateLabel(school),
      showCandidates: false
    })
  },

  collectCrushes() {
    const seen = new Set()
    const list = []
    for (const row of this.data.crushes) {
      const targetName = String(row.targetName || '').trim()
      if (!targetName) continue
      const key = targetName.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      list.push({
        targetName,
        targetSchoolId: null,
        targetEnrollmentYear: String(row.targetYear || '').trim() || null
      })
    }
    return list
  },

  submit() {
    const name = this.data.form.name.trim()
    const enrollmentYear = String(this.data.form.enrollmentYear || '').trim()
    const schoolId = this.data.schoolId
    const crushes = this.collectCrushes()

    if (!name) {
      wx.showToast({ title: '请填写我的名字', icon: 'none' })
      return
    }
    if (!schoolId) {
      wx.showToast({ title: '请先确认学校', icon: 'none' })
      return
    }
    if (!enrollmentYear || !/^\d{4}$/.test(enrollmentYear)) {
      wx.showToast({ title: '请填写 4 位入学年份', icon: 'none' })
      return
    }
    if (crushes.length < 1) {
      wx.showToast({ title: '至少写下 1 个名字', icon: 'none' })
      return
    }
    if (crushes.length > MAX_CRUSHES) {
      wx.showToast({ title: '最多 3 个心动名额', icon: 'none' })
      return
    }

    const rawRows = this.data.crushes.filter((r) => String(r.targetName || '').trim())
    const keys = rawRows.map((r) => String(r.targetName).trim().toLowerCase())
    if (keys.length !== new Set(keys).size) {
      wx.showToast({ title: '心动名单请勿重复', icon: 'none' })
      return
    }

    submitCrushes({
      user: {
        name,
        schoolId,
        enrollmentYear,
        city: this.data.form.city.trim()
      },
      crushes
    }).then(() => {
      wx.navigateTo({ url: '/pages/crushReveal/index' })
    })
  }
})
