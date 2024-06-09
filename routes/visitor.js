var express = require('express');
var router = express.Router();
const path = require("path");
var mongoose = require('mongoose');

const static_path = path.join(__dirname, "./public" );

console.log("visitor.js");

const visitor_schema = new mongoose.Schema({
	id: {type: String },
	content: { type: String },
 	password: { type: String }
},{
	collection: "visitor",
 	versionKey: false
})

var bid = 0

const visitor = mongoose.model('visitor', visitor_schema);

visitor.findOne({},{},{sort:{'_id':-1}})
.then(function(post){
	console.log(post.id);
	bid = post.id
}).catch(function(post){
	console.log("visitor is empty");
	bid = 0
});

router.get('/', function (req, res, next) {
	console.log("visitor");
	
	(async () => {
		try {
		  const visitors = await visitor.find();
		  console.log('검색된 방문자:', visitors);
		  return res.render('visitor.ejs', {"visitors":visitors});
		} catch (err) {
		  console.error(err);
		}
	  })();

	// return res.render('visitor.ejs', {"visitor":visitor});
});

router.get('/visitorNew', function (req, res, next) {
	console.log("visitorNew");

	return res.render('visitorNew.ejs');
});

router.get('/visitorEdit', async (req, res) => {
	console.log("visitorEdit");
	try {
		const vid = req.query.vid;

		const vEdit = await visitor.findOne({ id: vid });
	
		if (!vEdit) {
			return res.status(404).send('visitors not found');
		}
	
		res.render("visitorEdit.ejs", {"visitors":vEdit});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

router.post('/visitorUpdate', async (req, res) => {
	console.log("visitorUpdate");
	try {
	  	console.log("visitorUpdate post: ", req.body.id, req.body.content);
  
	  	const vid = req.body.id;
  
		if (!vid) {
			return res.status(400).json({
			status: 'error',
			error: 'vid parameter is missing',
			});
		}
  
		if (req.body.password !== req.body.password_o) {
			console.log("비밀번호가 틀림");
			return res.status(400).json({
			status: 'error',
			error: '비밀번호가 틀림',
			});
		}
  
		const updatedVisitor = await visitor.findOneAndUpdate(
			{ id: vid },
			{ $set: { content: req.body.content } },
			{ new: true } // To return the updated document
		);
  
		if (!updatedVisitor) {
			return res.status(404).json({
			status: 'error',
			error: 'Visitor not found',
			});
		}
  
	  	res.redirect('/visitor');
	} catch (error) {
	 	console.error(error);
	  	res.status(500).json({
			status: 'error',
			error: 'Internal Server Error',
	  	});
	}
  });
  

  router.post('/visitorSave', async (req, res) => {
	console.log("visitorSave");
	try {
		const id = req.body.id;
		const content = req.body.content;
		const password = req.body.password;
	
		const newVisitor = new visitor({
		  id: id,
		  content,
		  password,
		});
	
		await newVisitor.save();
	
		res.redirect("/visitor");
	  } catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	  }
  });
  
module.exports = router;
