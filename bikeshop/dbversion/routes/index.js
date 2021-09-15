const express = require('express');
const stripe = require('stripe')('sk_test_51JXqrmFpB9Tb2kkVAeTWP8I7Gv9iU29AowcoV65MVUwTMMVzdTwl5s41nau0bRnFNKpRYp1ulXF0XbDUYWNuVKqx00yZyE8Qup')
const Bike = require('./../models/bikeModel')


const router = express.Router();



/* GET home page. */
router.get('/', async (req, res, next) => {
  
  const bikes = await Bike.find()

  res.render('index', { bikes });
});

// GET Shop Page
router.get('/shop', async (req, res, next) => {
  if (!req.session.dataCardBike) req.session.dataCardBike = []
  const dataCardBike = req.session.dataCardBike

  const selectedBike = await Bike.findOne({name: req.query.name})

  if (selectedBike) {
    if (!dataCardBike.some(bike => bike.name == selectedBike.name)) {
      dataCardBike.push( {
        name: selectedBike.name,
        img: selectedBike.img,
        price: selectedBike.price,
        mea: selectedBike.mea,
        deliveries: selectedBike.deliveries,
        quantity: 1
      })
      console.log(dataCardBike)
    } else {
      const updatedBike = dataCardBike.find(bike => bike.name === req.query.name)
      updatedBike.quantity = Number(updatedBike.quantity)
      updatedBike.quantity +=1
      console.log('bike already in basket')
    }
  }

  res.render('shop', { title: 'Shop', dataCardBike });
});

router.get('/delete-shop', (req, res, next) => {
  const dataCardBike = req.session.dataCardBike
  dataCardBike.splice(req.query.bikeId, 1)
  res.render('shop', { title: 'Shop', dataCardBike })
})

router.post('/update-shop', (req, res, next) => {
  const dataCardBike = req.session.dataCardBike
  const newQt = req.body.qt
  const bikeId = req.body.bikeId

  dataCardBike[bikeId].quantity = newQt
  res.render('shop', { title: 'Shop', dataCardBike })
})

// STRIPE ROUTES

router.post('/create-checkout-session', async (req, res) => {
  const dataCardBike = req.session.dataCardBike
  const lineItems = []
  let normalFee = 3000
  let coupon = {}
  let discount = 1
  let deliveryFee= 0

  // Get total basket
  const totalBasket = Object.keys(dataCardBike).reduce((prev, key) => prev + (dataCardBike[key].price * dataCardBike[key].quantity), 0);
  
  if(totalBasket > 4000) {
      discount = 0
  } else if (totalBasket > 2000) {
      discount = 0.5
  }
  
  // Gestion des differents mode de livraison
  const deliveryType = req.body.deliveryType
  switch(deliveryType) {
    case 'standard':
      deliveryFee = 0
      break
    case 'express':
      deliveryFee = 10000
      break
    case 'relai': 
      deliveryFee = 5000 + (2000 * dataCardBike.length)
      discount = 0
      normalFee = 100
  }

  if(deliveryType != 'relai' && totalBasket > 4000) {
      normalFee = 0
      discount = 0
      deliveryFee = 0
  }

  const fdp = {
    price_data: {
      currency: 'eur',
      product_data: {
        name: 'Frais de port',
      },
      unit_amount: normalFee * discount + deliveryFee,
    },
    quantity: 1
  }

  dataCardBike.forEach(item => {
    lineItems.push( {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name}`,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })
  })

  // Add fdp
  lineItems.push(fdp)

 // Create coupon if total > 2000 €
//  if(totalBasket > 2000) {
//     coupon = await stripe.coupons.create({
//     percent_off: 20,
//     duration: 'once',
//   });
// }

// Create session without coupon
if (!coupon) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:3000/shop',
  });
  res.redirect(303, session.url);

} else {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    discounts: [{
      coupon: coupon.id,
    }],
    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:3000/shop',
  });
  res.redirect(303, session.url);
} 

});


// SUCCESS PAIEMENT

router.get('/success', async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  res.render('confirm', { session, customer })
})



module.exports = router;
