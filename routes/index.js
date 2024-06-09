var express = require('express');
var router = express.Router();
const path = require("path");

const static_path = path.join(__dirname, "./public" );

console.log("index.js");

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	return res.render('profile.ejs');
});

router.get('/ajax', function (req, res, next) {
	console.log("ajax");
	return res.render('ajax.ejs');
});

router.get('/ajaxSecurity', function (req, res, next) {
	console.log("ajaxSecurity");
	return res.render('ajaxSecurity.ejs');
});

router.get('/ajaxEx', function (req, res, next) {
	console.log("ajaxEx");
	return res.render('ajaxEx.ejs');
});

module.exports = router;
