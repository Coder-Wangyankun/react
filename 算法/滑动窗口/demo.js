/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxVowels = function(s, k) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let vowel = 0, res = 0
  let len = s.length
  for (let i = 0; i < len; i++) {
    if (vowels.includes(s[i])) {
      vowel++
    }
    if (i < k - 1) {
      continue
    }
    res = Math.max(res, vowel)
    if (vowels.includes(s[i - k + 1])) {
      vowel--
    }
  }
  return res
};