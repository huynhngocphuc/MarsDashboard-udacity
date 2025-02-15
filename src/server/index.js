require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
console.log(process.env.API_KEY);
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    // console.log('error:', err);
  }
});

app.get("/mars-photos/:namecar", async (req, res) => {
  console.log("🚀 ~ app.get ~ photos:", req.params.namecar)
  try {
    const nameCar = req.params.namecar.toLowerCase();
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${nameCar}/latest_photos?api_key=${process.env.API_KEY}`;
    let imageCar = await fetch(url)
    imageCar = await imageCar.json();
    res.send(imageCar)
} catch (error) {
    console.log('error:', error);
}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
