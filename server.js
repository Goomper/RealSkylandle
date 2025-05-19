import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import nunjucks from 'nunjucks'
import db from './db-sqlite.js'
import session from 'express-session'

const app = express()
const port = 3000

nunjucks.configure("views", {
    autoescape: true,
    express: app,
})

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        sameSite: 'lax',
        secure: false
     }
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))

app.get("/", async (req, res) => {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }

    const skylanders = await db.all('SELECT * FROM skylanders')
    req.session.skylanders = skylanders

    if (!req.session.guesses) {
        req.session.guesses = [];
    }

    const newGuess = req.query.Guess;

    if (req.session.views == 1) {
        const currentSkylander = skylanders[Math.floor(Math.random() * skylanders.length)]
        console.log(currentSkylander)
        req.session.currentSkylander = currentSkylander
    }

    const currentSkylander = req.session.currentSkylander

    skylanders.forEach(skylander => {
        if (newGuess && newGuess.toLowerCase() === skylander.name.toLowerCase()) {
            const alreadyGuessed = req.session.guesses.some(g => g.name.toLowerCase() === skylander.name.toLowerCase())
            if (!alreadyGuessed) {
                req.session.guesses.push(skylander)
            }
        }
    })

    const Guesses = req.session.guesses

    for (let i = 0; i < Guesses.length; i++) {
        if (Guesses && Guesses[i].name == currentSkylander.name) {
            res.redirect("/win")
            return
        }
    }

    res.render('skylandle.njk', {
        skylanders: skylanders,
        current: currentSkylander,
        views: req.session.views,
        guesses: req.session.guesses
    })
})

app.get("/win", (req, res) => {
    const guesses = req.session.guesses
    const currentskylander = req.session.currentSkylander
    
    if (guesses[guesses.length - 1].name != currentskylander.name) {
        return res.redirect("/error")
    }

    let currentSkylander = req.session.currentSkylander
    req.session.views = 0
    req.query.Guess = []
    console.log(currentSkylander)
    res.render("winscreen.njk", {
        current: currentSkylander,
        guesses: req.session.guesses
    })
})

app.get("/acount", (req, res) => {
    res.render("acount.njk")
})

app.get("/acount/sign-up", (req, res) => {
    res.render("signin.njk")
})

app.get("/error", (req, res) => {
    res.render("error.njk")
})

app.post("/api/guesses", (req, res) => {
    const newGuesses = req.body.guesses

    if (!Array.isArray(newGuesses)) {
        return res.status(400).json({ error: "Invalid data format" })
    }

    req.session.views = 0

    req.session.guesses = newGuesses; 
    res.status(200).json({ message: "Guesses updated successfully" })
})

app.get("/api/guesses", (req, res) => {
    const guesses = req.session.guesses || [];
    res.json({ guesses });
})

app.get("/api/skylanders", (req, res) => {
    const skylanders = req.session.skylanders || [];
    res.json({ skylanders });
})

app.get("/api/currentskylander", (req, res) => {
    const currentskylander = req.session.currentSkylander || [];
    res.json({ currentskylander });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})