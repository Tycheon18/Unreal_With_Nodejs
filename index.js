
const express = require("express");
const nunjucks = require("nunjucks");
const bodyparser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const wss = new WebSocket.Server({port : 8080});

const app = express();
const port = 3000;

nunjucks.configure("./views", {
    express: app,
    autoescape : true,
    noCache : true
});

app.use(bodyparser.urlencoded({ extended : true }));
app.use(bodyparser.json());

app.use(cors());

let jsonData = {
    name : "Defalut",
    description : "Default Description",
    color : "Black",
    number : 0,
    created_at : new Date().toISOString()
}


app.get("/", (req, res) => {
    console.log(req.query)
    res.send("Thank you for my friend!");
});

app.get("/nodejs", (req, res) => {
    console.log(req.query)
    let name = req.query.name || "Guest";
    res.render("index.html", {
        user: name
    });
});

app.get("/api/data", (req, res) => {
    res.json(jsonData);
});

app.post("/api/data", (req, res) => {
    jsonData = req.body;
    jsonData.created_at = new Date().toISOString();
    console.log("📩 Received Json :" , jsonData);

    broadcastToClients(jsonData);

    res.json({ status : "success", created_at : jsonData.created_at});
})

app.put("/api/data", (req, res) => {
    jsonData = { ...jsonData, ...req.body };
    jsonData.created_at = new Date().toISOString();
    console.log("🔄 Update JSON : ", jsonData);
    res.json({ status : "updated" , created_at : jsonData.created_at});
})

app.delete("/api/data", (req, res) =>{
    jsonData = {
        name : "Default",
        description : "Default Description",
        color : "Black",
        number : 0,
        created_at : new Date().toISOString()
    };

    res.json({status : "deleted"});
})

app.post("/nodejs", (req, res) => {
    console.log(req.body)

    const Color = req.body.Color;
    res.send(`<h1 style="color:${Color};">post 방식의 요청입니다.</h1>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`✅ WebSocket Server running on ws://localhost:8080`);
});

wss.on("connection", ws => {
    console.log("⚡ WebSocket Client Connected!");

    ws.on("message", message => {
        console.log("📡 Received:", message);

        try {
            let jsonData = JSON.parse(message);
            console.log("📩 Parsed JSON:", jsonData);
        } catch (error) {
            console.error("❌ Error parsing JSON:", error);
        }
    })

    broadcastToClients(message);

    ws.send(JSON.stringify({event: "Connected", message : "Welcome to WebSocket server!"}));

});

function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN)
        {
            client.send(JSON.stringify(data));
        }
    })
}