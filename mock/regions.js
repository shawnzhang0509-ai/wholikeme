/** Static province + prefecture-level cities for demo only (not a national library). */
const provinces = [
  { code: 'zj', name: '浙江' },
  { code: 'js', name: '江苏' },
  { code: 'sc', name: '四川' },
  { code: 'gd', name: '广东' },
  { code: 'sh', name: '上海' }
]

const prefectureCities = [
  { code: 'hz', name: '杭州市', provinceCode: 'zj' },
  { code: 'nb', name: '宁波市', provinceCode: 'zj' },
  { code: 'nj', name: '南京市', provinceCode: 'js' },
  { code: 'sz-js', name: '苏州市', provinceCode: 'js' },
  { code: 'cd', name: '成都市', provinceCode: 'sc' },
  { code: 'gz', name: '广州市', provinceCode: 'gd' },
  { code: 'sz-gd', name: '深圳市', provinceCode: 'gd' },
  { code: 'sh', name: '上海市', provinceCode: 'sh' }
]

function getCitiesByProvince(provinceCode) {
  return prefectureCities.filter((c) => c.provinceCode === provinceCode)
}

function findProvince(code) {
  return provinces.find((p) => p.code === code) || null
}

function findPrefectureCity(code) {
  return prefectureCities.find((c) => c.code === code) || null
}

module.exports = { provinces, prefectureCities, getCitiesByProvince, findProvince, findPrefectureCity }
