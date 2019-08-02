let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req,res,next) {
  let city = req.body.city
  if (city !== ""){
    res.redirect('/city')
  } else {

  } 
})

module.exports = router;
