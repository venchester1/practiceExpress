const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger)

//cross origin resouse sharing
const whitelist = [
  'https://www.yoursite.com', 
  'http://127.0.0.1:5500', 
  'http://localhost:3500'
]
const corsOptions = {
  origin: (origin, callback)  => {
    if(whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

// build-in middleware to handle urlencoded data
// in other words, form data:
//'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false}))

//build-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')))

app.get("^/$|/index(.html)?", (req, res) => {    
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
});

app.get("/new-page(.html)?", (req, res) => {    
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
});

//Route handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('attemted to load hello.html');
  next()
},(req, res) => {
  res.send("Hello world")
})

//chaining route handlers
const one = (req,res, next) => {
  console.log('one');
  next()
}

const two = (req, res, next) => {
  console.log('two');
  next()
}

const three = (req, res) => {
  console.log('three');
  res.send("finished!")
}


app.get('/chain(.html)?', [one, two,three])

app.get("/old-page(.html)?", (req, res) => {    
  res.redirect(301, '/new-page.html') //302 by default
});

app.get('/*', (req, res) => {
  res.status(404).sendFile((path.join(__dirname, 'views', '404.html')))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
