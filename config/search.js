/**
 * Created by hanwen on 29.05.14.
 */

var search,
    sio = require('socket.io');
    crud = require('./crud');

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
                    socket.emit('searchpathCallback','stuttgart' );
                });
            });

        return io;
    }
};



module.exports = search;