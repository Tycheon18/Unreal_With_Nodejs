const express = require("express");

const app = express();

const nunjucks = require("nunjucks");

app.set("view engine", "html")
nunjucks.configure("./views", {
    express: app
})

app.get("/", (req, res) => {
    console.log(req.query)
    res.send("Thank you for my friend!");
});

app.get("/nodejs", (req, res) => {
    console.log(req.query)
    let name = req.query.name
    res.render("index.html", {
        user: name
    });
});

const port = 3000;

app.post("/nodejs", (req, res) => {
    res.send("<h1>post 방식의 요청입니다.</h1>");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});