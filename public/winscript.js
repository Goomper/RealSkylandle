document.addEventListener("DOMContentLoaded", async () => {
    const guessresponse = await fetch("/api/guesses")
    const guessdata = await guessresponse.json()
    const guesses = guessdata.guesses

    const currentskylanderresponse = await fetch("/api/currentskylander")
    const currentskylanderdata = await currentskylanderresponse.json()
    const currentskylander = currentskylanderdata.currentskylander

    const againbutton = document.getElementById("AgainButton")
    againbutton.addEventListener("click", async () => {
        window.location.href = "/"
        guesses = []
        await fetch('/api/guesses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guesses: [] })
        })
    })

    const WinImgSpot = document.getElementsByClassName("WinImgSpot")

    const WinImg = document.createElement("div")
    WinImg.classList.add("WinImg")
    WinImgSpot[0].appendChild(WinImg)

    WinImg.style.backgroundImage = `url(/SkylanderImg/${currentskylander.name}.webp)`
})  