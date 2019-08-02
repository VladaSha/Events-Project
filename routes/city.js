let express = require('express');
let router = express.Router();
const axios = require('axios');

router.get('/city', function(req, res, next) {
  axios.get(`https://www.eventbriteapi.com/v3/categories/?token=${process.env.TOKEN}`)
    .then((response) => {
        res.render('city', {categories: response.data.categories, city: req.query.city})
    })
    .catch(err => {
      console.log(err)
    })
});

router.get('/subcategories/:categoryId', function(req,res,next){
    axios.get(`https://www.eventbriteapi.com/v3/categories/${req.params.categoryId}/?token=${process.env.TOKEN}`)
            .then((response) => {
                res.send(response.data)
              })
})

router.get('/events/:categoryId/:city', function(req,res,next){
    axios.get(`https://www.eventbriteapi.com/v3/events/search/?token=${process.env.TOKEN}&subcategories=${req.params.categoryId}&location.address=${req.params.city}`)
    .then((response) => {
        let events=response.data.events
        res.send(events)
    })
})

module.exports = router;
