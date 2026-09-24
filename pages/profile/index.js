const { provinces, getCitiesByProvince } = require('../../mock/regions')
const {
  searchSchoolCandidates,
  createSchoolFromRaw,
  candidateLabel,
  schoolById
} = require('../../mock/schools')
const { formatSchoolDisplay } = require('../../utils/school')

function extraSchools() {
  const app = getApp()
  return (app && app.globalData.customSchools) || []
}

Page({
  data: {
    form: { name: '', schoolRaw: '', enrollmentYear: '', districtText: '' },
    resolvedSchoolId: '',
    resolvedSchool: null,
    confirmedSchoolDisplay: '',
    candidates: [],
    selectedSchoolId: '',
    showCandidates: false,
    showCreatePanel: false,
    createForm: { provinceCode: 'zj', cityCode: 'hz', districtText: '' },
    provinceOptions: provinces.map((p) => p.name),
    provinceIndex: 0,
    cityOptions: [],
    cityIndex: 0
  },

  onLoad() {
    this.syncCityOptions('zj', 'hz')
    const cached = getApp().globalData.profile
    if (cached) this.hydrateProfile(cached)
  },

  hydrateProfile(profile) {
    const school = profile.resolvedSchool || schoolById(profile.resolvedSchoolId, extraSchools())
    const patch = {
      form: {
        name: profile.name || '',
        schoolRaw: profile.schoolRaw || '',
        enrollmentYear: profile.enrollmentYear ? String(profile.enrollmentYear) : '',
        districtText: profile.districtText || ''
      },
      resolvedSchoolId: profile.resolvedSchoolId || '',
      resolvedSchool: school,
      selectedSchoolId: profile.resolvedSchoolId || ''
    }
    if (school) {
      patch.confirmedSchoolDisplay = formatSchoolDisplay({
        city: school.city,
        name: school.name,
        enrollmentYear: profile.enrollmentYear
      })
    }
    this.setData(patch)
  },

  syncCityOptions(provinceCode, preferredCityCode) {
    const cities = getCitiesByProvince(provinceCode)
    const cityIndex = Math.max(0, cities.findIndex((c) => c.code === preferredCityCode))
    this.setData({
      cityOptions: cities.map((c) => c.name),
      cityIndex,
      'createForm.provinceCode': provinceCode,
      'createForm.cityCode': cities[cityIndex] ? cities[cityIndex].code : ''
    })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
    if (key === 'enrollmentYear' && this.data.resolvedSchool) {
      this.applyResolvedSchool(this.data.resolvedSchool)
    }
    if (key === 'schoolRaw') {
      this.setData({
        resolvedSchoolId: '',
        resolvedSchool: null,
        confirmedSchoolDisplay: '',
        selectedSchoolId: '',
        showCandidates: false,
        showCreatePanel: false
      })
    }
  },

  onProvinceChange(e) {
    const provinceIndex = Number(e.detail.value)
    const province = provinces[provinceIndex]
    this.setData({ provinceIndex })
    this.syncCityOptions(province.code)
  },

  onCityChange(e) {
    const cityIndex = Number(e.detail.value)
    const cities = getCitiesByProvince(this.data.createForm.provinceCode)
    const city = cities[cityIndex]
    this.setData({
      cityIndex,
      'createForm.cityCode': city ? city.code : ''
    })
  },

  onCreateDistrictInput(e) {
    this.setData({ 'createForm.districtText': e.detail.value })
  },

  searchSchools() {
    const raw = this.data.form.schoolRaw.trim()
    if (!raw) {
      wx.showToast({ title: '请先输入学校名称', icon: 'none' })
      return
    }
    const { candidates, autoSelected } = searchSchoolCandidates(raw, extraSchools())
    const patch = {
      candidates: candidates.map((c) => ({ id: c.id, label: candidateLabel(c) })),
      showCandidates: candidates.length > 0,
      showCreatePanel: false,
      selectedSchoolId: autoSelected ? autoSelected.id : this.data.selectedSchoolId
    }
    if (autoSelected) {
      this.applyResolvedSchool(autoSelected)
    } else {
      patch.resolvedSchoolId = ''
      patch.resolvedSchool = null
      patch.confirmedSchoolDisplay = ''
    }
    this.setData(patch)
    if (!candidates.length) {
      wx.showToast({ title: '未找到候选，可创建学校', icon: 'none' })
    } else if (candidates.length > 1) {
      wx.showToast({ title: '请选择你的学校', icon: 'none' })
    }
  },

  selectCandidate(e) {
    const id = e.currentTarget.dataset.id
    const school = schoolById(id, extraSchools())
    if (!school) return
    this.setData({ selectedSchoolId: id })
    this.applyResolvedSchool(school)
  },

  applyResolvedSchool(school) {
    const enrollmentYear = this.data.form.enrollmentYear
    this.setData({
      resolvedSchoolId: school.id,
      resolvedSchool: school,
      selectedSchoolId: school.id,
      confirmedSchoolDisplay: formatSchoolDisplay({
        city: school.city,
        name: school.name,
        enrollmentYear
      })
    })
  },

  openCreateSchool() {
    this.setData({ showCreatePanel: true, showCandidates: false })
  },

  submitCreateSchool() {
    const app = getApp()
    const school = createSchoolFromRaw(
      {
        rawName: this.data.form.schoolRaw,
        provinceCode: this.data.createForm.provinceCode,
        cityCode: this.data.createForm.cityCode,
        districtText: this.data.createForm.districtText || this.data.form.districtText
      },
      app.globalData.customSchools
    )
    if (!school) {
      wx.showToast({ title: '请完善省市信息', icon: 'none' })
      return
    }
    app.addCustomSchool(school)
    this.applyResolvedSchool(school)
    this.setData({ showCreatePanel: false })
    wx.showToast({ title: '已创建并选中', icon: 'none' })
  },

  submit() {
    const app = getApp()
    const profile = {
      name: this.data.form.name.trim(),
      schoolRaw: this.data.form.schoolRaw.trim(),
      resolvedSchoolId: this.data.resolvedSchoolId,
      resolvedSchool: this.data.resolvedSchool,
      enrollmentYear: this.data.form.enrollmentYear.trim(),
      districtText: this.data.form.districtText.trim()
    }
    if (!profile.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' })
      return
    }
    if (!profile.resolvedSchoolId) {
      wx.showToast({ title: '请先确认学校', icon: 'none' })
      return
    }
    app.setProfile(profile)
    wx.navigateTo({ url: '/pages/matching/index' })
  }
})
