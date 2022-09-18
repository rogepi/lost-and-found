export const formatDateTime = (time: Date) => {
  return time.toString().slice(0, 10) + ' ' + time.toString().slice(11, 16)
}

export const arrtrans = (baseArray: any[]) => {
  let len = baseArray.length
  let n = 10
  let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1)
  let res = []
  for (let i = 0; i < lineNum; i++) {
    let temp = baseArray.slice(i * n, i * n + n)
    res.push(temp)
  }
  return res
}
