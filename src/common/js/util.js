// 打乱数组
export function shuffle(arr) {
  let _arr = arr.slice() // 不改变原数组
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(i, 0)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 获取随机数
function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
