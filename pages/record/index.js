const {
  searchSchoolCandidates,
  createPendingSchool,
  getSchoolById,
  candidateLabel,
  saveMyAnchor,
  getMyAnchor,
  addLikedRecord
} = require('../../services/likedRecord')

Page({
  data: {
    phase: 'form',
    hasAnchor: false,
    anchorSummary: '',
    form: {
      name: '',
      schoolRaw: '',
      enrollmentYear: '',
      city: '',
      targetName: '',
      targetSchool: '',
      targetYear: ''
    },
    schoolId: '',
    schoolLabel: '',
    candidates: [],
    showCandidates: false
  },

  onLoad() {
    const anchor = getMyAnchor()
    const patch = {
      phase: 'form',
      'form.targetName': '',
      'form.targetSchool': '',
      'form.targetYear': ''
    }
    if (anchor) {
      const school = getSchoolById(anchor.schoolId)
      const schoolName = school ? candidateLabel(school) : '已确认学校'
      Object.assign(patch, {
        hasAnchor: true,
        anchorSummary: `${anchor.name} · ${schoolName} · ${anchor.enrollmentYear}级`,
        schoolId: anchor.schoolId,
        schoolLabel: schoolName
      })
    }
    this.setData(patch)
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
    if (key === 'schoolRaw') {
      this.setData({ schoolId: '', schoolLabel: '', candidates: [], showCandidates: false })
    }
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
        candidates: candidates.map((c) => ({ id: c.id, label: candidateLabel(c) }))
      })
      return
    }
    const pending = createPendingSchool(raw)
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

  submit() {
    const targetName = this.data.form.targetName.trim()
    if (!targetName) {
      wx.showToast({ title: '请填写对方名字', icon: 'none' })
      return
    }

    if (!this.data.hasAnchor) {
      const name = this.data.form.name.trim()
      const enrollmentYear = String(this.data.form.enrollmentYear || '').trim()
      if (!name) {
        wx.showToast({ title: '请填写我的名字', icon: 'none' })
        return
      }
      if (!this.data.schoolId) {
        wx.showToast({ title: '请先确认学校', icon: 'none' })
        return
      }
      if (!enrollmentYear || !/^\d{4}$/.test(enrollmentYear)) {
        wx.showToast({ title: '请填写 4 位入学年份', icon: 'none' })
        return
      }
      saveMyAnchor({
        name,
        schoolId: this.data.schoolId,
        enrollmentYear,
        city: this.data.form.city.trim()
      })
      this.setData({ hasAnchor: true })
    }

    addLikedRecord({
      targetName,
      targetSchoolId: null,
      targetEnrollmentYear: this.data.form.targetYear.trim() || null
    })

    this.setData({ phase: 'success' })
  },

  goAnother() {
    wx.redirectTo({ url: '/pages/record/index' })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/records/index' })
  },

  goHome() {
    wx.reLaunch({ url: '/pages/home/index' })
  }
})
