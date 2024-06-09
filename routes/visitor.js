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

router.get('/visitorEdit', async (req, res) => {
	try {
		const vid = (req.query.vid);

		const vEdit = await visitor.findOne({ id: vid });
	
		if (!vEdit) {
			// handle case where board is not found (e.g., send 404 error)
			return res.status(404).send('visitors not found');
		}
	
		res.render("visitorEdit.ejs", {"visitors":vEdit});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

router.post('/visitorSave', async (req, res) => {
	try {
	  	console.log("visitorSave post: ", req.body.id, req.body.content);
  
	  	const vid = (req.query.id);
	  	console.log("req.body.id:", req.body.id);
	  	console.log("req.body.content:", req.body.content);
	  	console.log("req.body.password:", req.body.password);
	  	console.log("req.body.password_o:", req.body.password_o);
  
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
  
		if (!updatedBoard) {
			return res.status(404).json({
			status: 'error',
			error: 'Visitor not found',
			});
		}
  
	  	res.redirect('/');
	} catch (error) {
	 	console.error(error);
	  	res.status(500).json({
			status: 'error',
			error: 'Internal Server Error',
	  	});
	}
  });
  
  
// router.post('/register', function(req, res, next) {
// 	console.log(req.body);
// 	var personInfo = req.body;


// 	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
// 		res.send();
// 	} else {
// 		if (personInfo.password == personInfo.passwordConf) {

// 			User.findOne({email:personInfo.email},function(err,data){
// 				if(!data){
// 					var c;
// 					User.findOne({},function(err,data){

// 						if (data) {
// 							console.log("if");
// 							c = data.unique_id + 1;
// 						}else{
// 							c=1;
// 						}

// 						var newPerson = new User({
// 							unique_id:c,
// 							email:personInfo.email,
// 							username: personInfo.username,
// 							password: personInfo.password,
// 							passwordConf: personInfo.passwordConf
// 						});

// 						newPerson.save(function(err, Person){
// 							if(err)
// 								console.log(err);
// 							else
// 								console.log('Success');
// 						});

// 					}).sort({_id: -1}).limit(1);
// 					res.send({"Success":"You are regestered,You can login now."});
// 				}else{
// 					res.send({"Success":"Email is already used."});
// 				}

// 			});
// 		}else{
// 			res.send({"Success":"password is not matched"});
// 		}
// 	}
// });

// router.get('/login', function (req, res, next) {
// 	return res.render('login.ejs');
// });

// router.get('/register', function (req, res, next) {
// 	return res.render('register.ejs');
// });

// router.post('/login', function (req, res, next) {
// 	//console.log(req.body);
// 	User.findOne({email:req.body.email},function(err,data){
// 		if(data){
			
// 			if(data.password==req.body.password){
// 				//console.log("Done Login");
// 				req.session.userId = data.unique_id;
// 				req.session.username = data.username;
// 				//console.log(req.session.userId);
// 				res.send({"Success":"Success!"});
// 			        //res.render('loghome.ejs', {"name":data.username,"email":data.email});
				
// 			}else{
// 				res.send({"Success":"Wrong password!"});
// 			}
// 		}else{
// 			res.send({"Success":"This Email Is not regestered!"});
// 		}
// 	});
// });

// router.get('/profile', function (req, res, next) {
// 	console.log("profile");
// 	User.findOne({unique_id:req.session.userId},function(err,data){
// 		console.log("data");
// 		console.log(data);
// 		if(!data){
// 			res.redirect('/');
// 		}else{
// 			//console.log("found");
// 			return res.render('profile.ejs', {"name":data.username,"email":data.email});
// 		}
// 	});
// });

// router.get('/logout', function (req, res, next) {
// 	console.log("logout")
// 	if (req.session) {
//     // delete session object
//     req.session.destroy(function (err) {
//     	if (err) {
//     		return next(err);
//     	} else {
//     		return res.redirect('/');
//     	}
//     });
// }
// });

// router.get('/forgetpass', function (req, res, next) {
// 	res.render("forget.ejs");
// });

// router.post('/forgetpass', function (req, res, next) {
// 	//console.log('req.body');
// 	//console.log(req.body);
// 	User.findOne({email:req.body.email},function(err,data){
// 		console.log(data);
// 		if(!data){
// 			res.send({"Success":"This Email Is not regestered!"});
// 		}else{
// 			// res.send({"Success":"Success!"});
// 			if (req.body.password==req.body.passwordConf) {
// 			data.password=req.body.password;
// 			data.passwordConf=req.body.passwordConf;

// 			data.save(function(err, Person){
// 				if(err)
// 					console.log(err);
// 				else
// 					console.log('Success');
// 					res.send({"Success":"Password changed!"});
// 			});
// 		}else{
// 			res.send({"Success":"Password does not matched! Both Password should be same."});
// 		}
// 		}
// 	});
	
// });

module.exports = router;
