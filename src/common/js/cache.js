import storage from 'good-storage'

const SEARCH_KEY = '__search__'

function insertArray(word, list, compareFunc, maxLen) {
  const findIndex = list.findIndex(compareFunc) // 灵活定义比较函数
  if (findIndex === 0) {
    return
  }
  if (findIndex > 0) {
    list.splice(findIndex, 1)
  }
  list.unshift(word)
  if (list.length > maxLen) {
    list.pop()
  }
}

function delestHistory(word, list, compareFunc) {
  const findIndex = list.findIndex(compareFunc)
  if (findIndex >= 0) {
    list.splice(findIndex, 1)
  }
}

export function saveSearch(word, maxLen = 20) {
  const history = storage.get(SEARCH_KEY, [])
  if (!word) {
    return history
  }
  insertArray(word, history, (item) => {
    return item === word
  }, maxLen)
  storage.set(SEARCH_KEY, history)
  return history
}

export function deleteSearch(word) {
  const history = storage.get(SEARCH_KEY)
  delestHistory(word, history, (item) => {
    return item === word
  })
  storage.set(SEARCH_KEY, history)
  return history
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
