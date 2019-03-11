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

// 操作el的name属性，有val则赋值，没有则取值
export function getData(el, name, val) {
  name = 'data-' + name
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}

let elementStyle = document.createElement('div').style
console.log(elementStyle)

// 添加浏览器前缀，定义autoprefix逻辑
let prefix = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ma: 'msTransform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (prefix === false) {
    return
  }
  if (prefix === 'standard') {
    return style
  }
  return prefix + style.substr(0, 1).toUpperCase() + style.substr(1)
}
