var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var faceCollectionSchema = new Schema({  
  name:    		{ type: String ,required: true },
  id:     		{ type: String ,required: true },
  timeMoment:  	{ type: String ,required: true }
});

module.exports = mongoose.model('faceCollectionModel', faceCollectionSchema); 