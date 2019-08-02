const express = require('express');
const router = express.Router();
const Event = require("../models/Event")
const User = require("../models/User")

/* GET Profile page. */
router.get('/profile', function(req, res, next) {
    debugger
    if(req.cookies.name) {
        let newEvent = new Event({
            name: req.cookies.name,
            event_id: req.cookies.event_id
        })
        Event.create(newEvent)
        .then((response) => {
            let userId = req.session.currentUser._id
            let newEventId = response._id
            return User.findByIdAndUpdate(userId, {$push: {favoriteEvents: newEventId}}, {new: true})
            .populate("favoriteEvents")
        })
        .then((secondResponse) => {
            res.render('profile', {user: secondResponse});
        })
        .catch(error => next(error))
    } else {
        let userId = req.session.currentUser._id
        User.findById(userId)
        .populate("favoriteEvents")
        .then((secondResponse) => {
            res.render('profile', {user: secondResponse});
        })
        .catch(error => next(error))
    }
});



module.exports = router;