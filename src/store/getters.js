// 有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数。减少我们对这些状态数据的操作
// 简单粗暴理解：状态树上的数据比较复杂了，我们使用的时候要简化操作，
export const singer = state => state.singer
