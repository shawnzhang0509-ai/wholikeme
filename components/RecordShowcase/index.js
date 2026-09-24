Component({
  properties: {
    title: { type: String, value: '双向喜欢，记录会怎样变？' },
    subtitle: {
      type: String,
      value: '先写下你喜欢谁。保存后默认是左边灰卡；只有双向确认，才会变成右边这样。'
    },
    footnote: {
      type: String,
      value: '演示用 Ada 触发双向流程；不会通知对方，也不会公开你的名单。'
    }
  }
})
