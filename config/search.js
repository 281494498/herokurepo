/**
 * Created by hanwen on 29.05.14.
 */

var search,
    sio = require('socket.io');
    crud = require('./crud');
var Path            = require('../app/models/path');

search = {
    connect : function(server){
        var io = sio.listen(server);

        //Begin setup
        io
            .set('blacklist', [])
            .of('/zugzug')
            .on('connection', function(socket){
                socket.on('searchpath', function(search_map){
                    console.dir(search_map);
                    Path.find({ start: search_map.start, end:search_map.end }, function(err, result){
                        console.dir(result);
                        socket.emit('searchpathCallback',result ,'here');
                    });
                });

                socket.on('addpath', function(path_map){
                    console.log('add path socket received' + path_map );
                    crud.create(Path,
                        path_map,
                        function(result){
                            io.emit('addpathCallback', result);
                        });
                });
            });

        return io;
    }
};



module.exports = search;