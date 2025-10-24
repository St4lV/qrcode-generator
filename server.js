const express = require('express');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running on port ${port}.`);
});

///// CLIENT /////

app.get("/", async (req, res) => {
    res.sendFile('/client/index.html', {root: __dirname});
});

app.get("/index.js", async (req, res) => {
    res.sendFile('/client/index.js', {root: __dirname});
});

app.get("/index.css", async (req, res) => {
    res.sendFile('/client/index.css', {root: __dirname});
});

///// PUBLIC /////

app.get("/favicon.ico", async (req, res) => {
    res.sendFile('/public/favicon.ico', {root: __dirname});
});

app.get("/sitemap.xml", async (req,res) =>{
    res.sendFile('/public/sitemap.xml', {root: __dirname})
});

app.get("/robots.txt", async (req,res) =>{
    res.sendFile('/public/robots.txt', {root: __dirname})
});

///// API /////

app.post("/generate-qr-code", async (req, res) => {
    const url = req.body.url;
    console.log(url);
    
    try {
        const result = await genQRCode(url);
        return res.status(200).type("image/png").send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate QR code" });
    }
});

async function genQRCode(url) {
    const qrCodeBuffer = await QRCode.toBuffer(url);
    return qrCodeBuffer;
}