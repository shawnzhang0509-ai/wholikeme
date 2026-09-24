Component({
  properties: {
    type: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false }
  },
  methods: {
    onTap() { this.triggerEvent('tap') }
  }
})
