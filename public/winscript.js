document.addEventListener("DOMContentLoaded", async () => {
    const GuessesResponse = await fetch("/api/guesses")
    const GuessData = await GuessesResponse.json()

    const againbutton = document.getElementById("AgainButton")
    againbutton.addEventListener("click", async () => {
        window.location.href = "/"
        GuessData.guesses = []
        await fetch('/api/guesses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guesses: [] })
        })
    })
})  