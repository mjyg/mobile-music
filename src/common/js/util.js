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

// 函数节流
// 定义：触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次
// 的函数调用。
// 原理：对处理函数进行延时操作，若设定的延时到来之前，再次触发事件，则清除上一次的延时操作定时器，重新定时。

// 搜索词改变过快（输入或删除过程）时避免提交无意义的搜索请求，节约流量，优化性能
export function debounce(func, delay) {
  let timer // 闭包函数中该计时器被缓存，共用同一个计时器timer
  return (...args) => {
    if (timer) { // 如果上一次操作延时未到，清空上一次的定时，取消上一次操作
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.call(this, ...args) // 也可以写成 func.apply(this, args)或 func(...args)
    }, delay)
  }
}
