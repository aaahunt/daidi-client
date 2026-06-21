function sortBySuit(a, b) {
  if (a.suitInfo.value !== b.suitInfo.value) {
    return a.suitInfo.value - b.suitInfo.value
  }

  return a.value - b.value
}

function sortByRank(a, b) {
  if (a.rankValue !== b.rankValue) {
    return a.rankValue - b.rankValue
  }
  return a.value - b.value
}

module.exports = { sortBySuit, sortByRank }
