Component({
  properties: { lines: { type: Array, value: [] }, interval: { type: Number, value: 650 } },
  data: { index: 0, timer: null },
  lifetimes: {
    attached() { this.start() },
    detached() { this.stop() }
  },
  methods: {
    start() {
      this.stop()
      const timer = setInterval(() => {
        const next = this.data.index + 1
        if (next >= this.data.lines.length) {
          this.stop()
          this.triggerEvent('done')
          return
        }
        this.setData({ index: next })
      }, this.data.interval)
      this.setData({ timer })
    },
    stop() {
      if (this.data.timer) clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  }
})
