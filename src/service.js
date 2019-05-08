const pushAs = (role, message) =>
      fetch('/message', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: role,
          content: message,
          date: new Date()
        })
      })

const pull = () => 
      fetch('/messages')
      .then(response => response.text())
      .then(JSON.parse)

const entitySelection = (rawSelection) => {
  const message = rawSelection.message
  const begin = Math.min(rawSelection.anchorOffset, rawSelection.focusOffset)
  const count = Math.abs(rawSelection.anchorOffset - rawSelection.focusOffset)
  return { message, begin, count }
}

window.service = { pushAs, pull, entitySelection }
