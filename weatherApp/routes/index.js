var express = require('express');
var router = express.Router();

const cityList = [
  {
    name: 'Paris',
    url:'/images/picto-1.png',
    mintemp: 10,
    maxtemp: 16,
    description: 'bof'
  },
  {
    name: 'Londres',
    url:'/images/picto-1.png',
    mintemp: 8,
    maxtemp: 13,
    description: 'english weather'
  },
  {
    name: 'Madrid',
    url:'/images/picto-1.png',
    mintemp: 24,
    maxtemp: 31,
    description: 'ensoleillé bébé'
  }
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Weather App' });
});

// Weather Page
router.get('/weather', function(req, res, next) {
  res.render('weather', { cityList });
});

router.post('/add-city', function(req, res, next) {

  const alreadyIn = cityList.some(city => city.name == req.body.cityname)

  if(!alreadyIn && req.body.cityname) {
    cityList.push({
      name: req.body.cityname,
      url:'/images/picto-1.png',
      mintemp: 24,
      maxtemp: 31,
      description: 'toujours soleil'
    })
  }

  res.render('weather', { cityList });
});

router.get('/delete-city', (req, res, next) => {
  cityList.splice(req.query.id, 1)

  res.render('weather', { cityList })
})

module.exports = router;
