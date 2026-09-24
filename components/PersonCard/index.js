const { joinParts, relationLabel } = require('../../utils/format')
Component({
  properties: { person: { type: Object, value: {} } },
  data: { initial: '?', meta: '', label: '' },
  observers: {
    person(p) {
      const meta = p.schoolDisplay || joinParts([p.school, p.enrollmentYear ? `${p.enrollmentYear} 级` : '', p.city])
      this.setData({
        initial: (p.name || '?').slice(0, 1),
        meta,
        label: relationLabel(p.type)
      })
    }
  },
  methods: { onOpen() { this.triggerEvent('open', { person: this.data.person }) } }
})
