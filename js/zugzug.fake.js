/**
 * Created by hanwen on 28.05.14.
 */

zugzug.fake = (function(){
    'use strict';
    var getCityList, mockSio, fakeSerial = 5, makeFakeId, getPathList;

    makeFakeId = function(){
      return  'id_'+String(fakeSerial++);
    };

    getPathList = function(){
        return [
            {
                start : 'stuttgart',
                end : 'berlin',
                date : '01/06',
                member : 4,
                _id : 1
            },
            {
                start : 'munich',
                end : 'berlin',
                date : '01/06',
                member : 4,
                _id : 2
            }
        ]
    };

    getCityList = function(){
      return [
          {
              name : 'stuttgart',
              state : 'Baden-württemberg',
              _id : '01'
          },
          {
              name : 'munich',
              state : 'Bayern',
              _id : '02'
          },
          {
              name : 'berlin',
              state : 'Berlin',
              _id : '03'
          }
      ];
    };

    mockSio = (function(){
        var on_sio, emit_sio, callback_map = {};

        on_sio = function(msg_type, callback){
            callback_map[msg_type] = callback;
        };

        emit_sio = function(msg_type, data){
            if(msg_type === 'addcity' && callback_map.addcityCallback){
                setTimeout(function(){
                    callback_map.addcityCallback(       //TODO why here argument is a array?
                        [{ _id : makeFakeId(),
                            name : data.name,
                            state : data.state
                        }]
                    );
                },1000)
            }

            else if(msg_type === 'searchpath' && callback_map.searchpathCallback){
                setTimeout(function(){
                    callback_map.searchpathCallback(
                                //TODO
                    );
                },1000)
            }
        };

        return {
            emit : emit_sio,
            on : on_sio
        }
    }());

    return {
        getPathList : getPathList,
        getCityList : getCityList,
        mockSio : mockSio
    };
}());