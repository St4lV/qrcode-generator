const express = require('express');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running on port ${port}.`);
});

app.get("/", async (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.get("/favicon.ico", async (req, res) => {
    res.sendFile('favicon.ico', {root: __dirname});
});

app.get("/sitemap.xml", async (req,res) =>{
    res.sendFile('sitemap.xml', {root: __dirname})
});

app.get("/robots.txt", async (req,res) =>{
    res.sendFile('robots.txt', {root: __dirname})
});

app.post("/generate-qr-code", async (req, res) => {
    const url = req.body.url;//"https://linktr.ee/djfolai"
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