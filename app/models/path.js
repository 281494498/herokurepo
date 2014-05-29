/**
 * Created by hanwen on 29.05.14.
 */

var mongoose = require('mongoose');

var Path = mongoose.Schema({
    start: { type : String, min: 4, max : 20, required :true },
    end  : { type : String, min: 4, max : 20, required :true  },
    member : {type : Number,  min:1, max :4},
    date : {type :Date},
    id : String
});

module.exports = mongoose.model('path', Path);