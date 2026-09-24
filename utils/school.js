const { schoolById } = require('../mock/schools')

function formatSchoolDisplay({ city, name, enrollmentYear }) {
  const parts = [city, name].filter(Boolean)
  const base = parts.join(' · ')
  if (!base && !enrollmentYear) return '学校待确认'
  if (!enrollmentYear) return base
  return `${base} · ${enrollmentYear}级`
}

function resolveSchoolRecord(profile, extraSchools = []) {
  if (!profile || !profile.resolvedSchoolId) return null
  if (profile.resolvedSchool && profile.resolvedSchool.id === profile.resolvedSchoolId) {
    return profile.resolvedSchool
  }
  return schoolById(profile.resolvedSchoolId, extraSchools)
}

function profileSchoolDisplay(profile, extraSchools = []) {
  const school = resolveSchoolRecord(profile, extraSchools)
  if (!school) return ''
  return formatSchoolDisplay({
    city: school.city,
    name: school.name,
    enrollmentYear: profile.enrollmentYear
  })
}

function enrichPerson(person, extraSchools = []) {
  const school = person.schoolId ? schoolById(person.schoolId, extraSchools) : null
  const city = school ? school.city : person.city
  const name = school ? school.name : person.school
  return {
    ...person,
    schoolDisplay: formatSchoolDisplay({
      city,
      name,
      enrollmentYear: person.enrollmentYear
    })
  }
}

module.exports = {
  formatSchoolDisplay,
  resolveSchoolRecord,
  profileSchoolDisplay,
  enrichPerson
}
