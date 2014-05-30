/**
 * Created by hanwen on 30.05.14.
 */

'use strict';

var mongoose = require('mongoose');
//var fsHandle = require('fs');

var constructObj, readObj, updateObj, destroyObj;

constructObj = function(obj_type, obj_map, callback){
    var newObj = new obj_type(obj_map);
    newObj.save(function(err, result_map){
        if(err){
           console.warn(err.name);
           console.dir(err.error);
        }
        console.log('successful add the object'+ result_map);
        callback(result_map);// send back the object
    });
};

readObj = function(obj_type, find_map, fields_map, callback){
    var newObj = new obj_type(obj_map);
    newObj.save(function(err, result_map){
        if(err){
            console.warn(err.name);
            console.dir(err.error);
        }
        console.log('successful add the object'+ result_map);
        callback(result_map);// send back the object
    });
};

updateObj = function(obj_type, obj_map, callback){
    var newObj = new obj_type(obj_map);
    newObj.save(function(err, result_map){
        if(err){
            console.warn(err.name);
            console.dir(err.error);
        }
        console.log('successful add the object'+ result_map);
        callback(result_map);// send back the object
    });
};

destroyObj = function(obj_type, obj_map, callback){
    var newObj = new obj_type(obj_map);
    newObj.save(function(err, result_map){
        if(err){
            console.warn(err.name);
            console.dir(err.error);
        }
        console.log('successful add the object'+ result_map);
        callback(result_map);// send back the object
    });
};

module.exports = {
    create : constructObj,
    read      : readObj,
    update : updateObj,
    delete : destroyObj
};