const express = require('express');
const request = require('sync-request')
const API_KEY = '588d61cff312321941215283a6a1a44b';
const City = require('./../models/cityModel')

const router = express.Router();

const cityList = []

let error = ''

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Weather App' });
});

// GET WEATHER ROUTE
router.get('/weather', async (req, res, next) => {
  const cities = await City.find()

  res.render('weather', { cities, error });
});

// POST NEW CITY ROUTE
router.post('/add-city', async (req, res, next) => {

  // const alreadyIn = cityList.some(city => city.name == req.body.cityname)

  const requete = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityname}&units=metric&lang=fr&appid=${API_KEY}`)
  const dataAPI = JSON.parse(requete.body)

  if(dataAPI.cod !== 200) {
     error = 'City not found. Sorry.'
  }

  if(req.body.cityname && dataAPI.cod == 200) {
       error = ''  
  //   cityList.push({
  //     name: dataAPI.name,
  //     url: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`,
  //     mintemp: dataAPI.main['temp_min'],
  //     maxtemp: dataAPI.main['temp_max'],
  //     description: dataAPI.weather[0].description
  //   })

      const newCity = City.create({
        name: dataAPI.name,
        url: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`,
        mintemp: dataAPI.main['temp_min'],
        maxtemp: dataAPI.main['temp_max'],
        description: dataAPI.weather[0].description
      })
  }

  const cities = await City.find()

  res.render('weather', { cities, error });
});


// DELETE ROUTE
router.get('/delete-city', (req, res, next) => {
  cityList.splice(req.query.id, 1)

  res.render('weather', { cityList, error })
})

module.exports = router;
