// Bootstrap Components
import Container from "react-bootstrap/Container"

const Rules = () => {
  return (
    <Container className="mt-3">
      <h1>Dai Di (Big Two) Rules</h1>
      <p>
        The game is intended for four players but can also be played with three
        or two. Here you will play with two players.
      </p>

      <h2>Objective</h2>
      <p>The objective is simple; get rid of all your cards.</p>

      <h2>Game Flow</h2>
      <p>
        Play goes in turns and you must play the same number of cards as your
        opponent, and your hand must be higher in rank that your opponent's
        hand.
      </p>
      <p>
        If you win the round then you get to choose how many cards to play, and
        your opponent must follow.
      </p>
      <p>
        You can play a single card, a pair, three of a kind, or any valid five
        card poker hand (from a straight or higher).
      </p>

      <h2>Deuces</h2>
      <p>
        The biggest difference in this game is that deuces are the highest rank
        card, i.e. 3,4,5,6,7,8,9,T,J,Q,K,A,2.
      </p>

      <h2>Suit Matters</h2>
      <p>
        Each suit is ranked, from worst to best they are: diamonds, clubs,
        hearts, spades. Suit is only taken into account on tie breaks.
      </p>
      <p>
        For example, if your opponent were to play Jh you could play the Js but
        not the Jc.
      </p>
      <p>
        If you're opponent were to, however, play an Ace high flush in diamonds,
        a worse flush in spades would not win
      </p>

      <h2>Scoring</h2>
      <p>
        The winner scores one point for every card that their opponent has
        remaining. If the opponent has 10, 11, or 12 cards, it's two points per
        card. If they have all 13 cards still, you gain 3 points per card (i.e.
        39 points).
      </p>

      <h2>Who goes first?</h2>
      <p>
        The player with the lowest ranking card goes first. This information is
        given to you at the start.
      </p>

      <h2>Passing</h2>
      <p>
        You can pass at any point, either because you have to, or because you
        tactically want to.
      </p>
    </Container>
  )
}

export default Rules
