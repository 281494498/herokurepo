/**
 * Created by hanwen on 29.05.14.
 */

var mongoose = require('mongoose');

var pathSchema = mongoose.Schema({
    start: { type : String, required :true },   //make the length validate in client side
    end  : { type : String, required :true  },
    member : {type : Number,  min:1, max :4},
    date : {type :Date, default : Date.now },
    id : String,
    user : String
});
//,{safe : 'safe'} safe option here
pathSchema.statics.findByName = function(name, callback){
    this.find({ name: new RegExp(name, 'i') }, callback);
};

module.exports = mongoose.model('Path', pathSchema);