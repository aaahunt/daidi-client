import React, { useContext, useState } from "react"

const emojis = ["😁", "😘", "😲", "😑", "😭"]

const Emojis = ({ opponent }) => {
  const [clicked, setClicked] = useState(null)

  const handleClick = (emoji, opponent, e) => {
    // socket.emit("emoji", emoji, opponent)
    setClicked(e.target.innerText)
    setTimeout(() => {
      setClicked(null)
    }, 1000)
  }

  const emojiList = emojis.map((emoji, i) => (
    <h3 key={i} onClick={(e) => handleClick(emoji, opponent, e)} className={emoji === clicked ? "active" : ""}>
      {emoji}
    </h3>
  ))

  return <div className="emojis">{emojiList}</div>
}

export default Emojis
