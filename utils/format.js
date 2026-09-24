function joinParts(parts) {
  return parts.filter(Boolean).join(' · ')
}

function relationLabel(type) {
  const map = {
    liked: '❤️ 关系待解锁',
    classmate: '可能是同学',
    friend: '可能是朋友',
    schoolmate: '可能是校友',
    coworker: '可能是同事',
    family: '可能是家人',
    crush: '心动信号',
    unknown: '👀 身份待确认'
  }
  return map[type] || map.unknown
}

module.exports = { joinParts, relationLabel }
