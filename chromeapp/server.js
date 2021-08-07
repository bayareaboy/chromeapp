const logger = require('morgan');
const express = require('express');
const axios = require("axios")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");
const path = require("path");
const cors = require("cors");

const error = chalk.bold.red;
const success = chalk.keyword("green");


// Create an Express application
const app = express();
app.set("view engine", "ejs");
// Public folder directory
app.use(express.static(path.join(__dirname, "public")));

// Data Parsing
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.get('/', (req, res)=> {
    res.render('index')
})


app.post('/api', async (req, res) => {
  const {url} = req.body

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //     const res = await axios.get
  
    await page.goto(url);
    const title = await page.title()
    // const title = webpage.title
    // const price = await page.$('.product-intro__head-price')
    const price = await page.$eval('.del-price ', (e) => e.textContent)
    const size = await page.$eval('.inner ', (e) => e.textContent)
    const image = await page.$eval('.productimg-extend__main-image', (e) => e.innerHTML)
    
    // res("title" + title, "price" + price, "size" + size, "image" + image)
    res.json({"title":title, "price":price, "size":size, "image":image})
    await browser.close();
  } catch (err) {
    console.error(err.message)
  }
})


// Configure the app port
const port = process.env.PORT || 3000;
app.set('port', port);

// Load middlewares
app.use(logger('dev'));

// Start the server and listen on the preconfigured port
app.listen(port, () => console.log(`App started on port ${port}.`));