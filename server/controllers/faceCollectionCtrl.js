var mongoose = require('mongoose');  
var faceCollection  = mongoose.model('faceCollectionModel');

//GET - Return all tvshows in the DB
exports.findAllFaces = function(req, res) {  
    faceCollection.find(function(err, faceSaved) {
    if(err) res.send(500, err.message);

    console.log('GET /faces')
        res.status(200).jsonp(faceSaved);
    });
};

exports.addFaces = function(req, res) {
	console.log('POST');
	console.log(req.body);
	var newFace = new faceCollection({
		name:    	req.body.name,
		id: 	  	req.body.id,
		timeMoment: req.body.timeMoment
	});
	newFace.save(function(err, newFace) {
		if(err) return res.send(500, err.message);
    	res.status(200).jsonp(newFace);
	});
};

exports.deleteFaces = function(req, res) {
	faceCollection.find( function(err, user) {
		user.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.json({ message: 'Successfully deleted' });
		});
	});
};