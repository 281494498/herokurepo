/**
 * Created by hanwen on 28.05.14.
 */

zugzug.fake = (function(){
    'use strict';
    var getCityList;

    getCityList = function(){
      return [
          {
              name : stuttgart,
              state : Baden-württemberg
          },
          {
              name : munich,
              state : Bayern
          },
          {
              name : berlin,
              state : Berlin
          }
      ];
    };

    return {
        getCityList : getCityList
    };
}());