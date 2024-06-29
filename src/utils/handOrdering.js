// Sorting function to sort by card rank value
const byRank = (a, b) => {
  if (a.rankValue > b.rankValue) return 1
  if (a.rankValue < b.rankValue) return -1
  return 0
}

// Utility function to find the most common occuring card in an array of cards
const modeCard = (cards) => {
  return [...cards]
    .sort(
      (a, b) =>
        cards.filter((v) => v.rank === a.rank).length -
        cards.filter((v) => v.rank === b.rank).length
    )
    .pop()
}

module.exports = { byRank, modeCard }
