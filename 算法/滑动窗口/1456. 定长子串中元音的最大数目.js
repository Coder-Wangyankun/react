/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxVowels = function(s, k) {
    const len = s.length;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let res = 0, vowel = 0
    for (let i = 0; i < len; i++) {
      // 窗口最右边的元素进入窗口
      let cur = s[i]
      if (vowels.includes(cur)) {
        vowel++
      }
      if (i < k - 1) {
        continue
      }
      // 第一次到这是第一次形成元素数为k的窗口
      res = Math.max(res, vowel) // 第一次更新res
      // 窗口最左边的元素离开窗口
      if (vowels.includes(s[i - k + 1])) {
        vowel--
      }
    }
    return res
};