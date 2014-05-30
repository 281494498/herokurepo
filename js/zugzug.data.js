/**
 * Created by hanwen on 28.05.14.
 */

/*
 * Data module
 */

zugzug.data = (function () {
    'use strict';
    var
        stateMap = { sio : null },
        makeSio, getSio, initModule;

    makeSio = function (){
        var socket = io.connect( '/zugzug' );

        return {
            emit : function ( event_name, data ) {
                socket.emit( event_name, data );
            },
            on   : function ( event_name, callback ) {
                socket.on( event_name, function (){
                    callback( arguments );
                });
            }
        };
    };

    //singleton here!
    getSio = function (){
        if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }
        return stateMap.sio;
    };

    initModule = function (){}; //it just to make sure the file this part is loaded

    return {
        getSio     : getSio,
        initModule : initModule
    };
}());
