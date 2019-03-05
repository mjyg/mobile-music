// 添加class
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let oldClass = el.className.split(' ')
  oldClass.push(className)
  el.className = oldClass.join(' ')
}

// 是否有该class
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)') // 匹配className前后空白字符
  return reg.test(el.className)
}
