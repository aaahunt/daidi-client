/**
 * Return the rank of our hand
 *
 * @param {Array} hand - Array of card objects
 *
 * @return {Number} - The rank of the hand
 * Invalid = 0, Straight = 1, Flush = 2, Full house = 3, Quads = 4, Straight flush = 5, Royal flush = 6
 */
const handRanking = (hand) => {
  const flush = hand.every((card) => card.suit === hand[0].suit)

  const unique_count = [...new Set(hand.map((card) => card.rankValue))]

  // If there are only two unique cards in the hand we must have Full house or Quads
  if (unique_count.length === 2) {
    // Count the number of times the first card appears
    let countFirst = hand.reduce((n, card) => {
      return n + (card.rankValue === hand[0].rankValue)
    }, 0)
    // If count = 2 or 3 must be full house, else must be quads (because would be 1 or 4 cards)
    if (countFirst === 2 || countFirst === 3) return 3 // Full house
    return 4 // Quads
  }

  // Straights check
  let straight = false
  if (unique_count.length === 5) {
    straight = checkForStraight(hand)
  }

  //Royal flush
  let containsAceKing =
    hand.some((e) => e.rank === "K") && hand.some((e) => e.rank === "A")
  if (flush && straight && containsAceKing) return 6

  // Straight flush
  if (flush && straight) return 5

  if (flush) return 2
  if (straight) return 1
  return 0
}

const checkForStraight = (hand) => {
  const sortedHand = hand.sort(this.byRank)

  let straight = true
  // loop through sorted hand and check that value increases
  for (let i = 1; i < sortedHand.length; i++) {
    if (sortedHand[i].rankValue !== sortedHand[i - 1].rankValue + 1) {
      // Take into account straights containing a deuce
      if (
        (i === 3 || i === 4) &&
        sortedHand[i].rankValue === sortedHand[i - 1].rankValue + 9
      )
        continue
      straight = false
      break
    }
  }
  return straight
}

module.exports = { handRanking }
