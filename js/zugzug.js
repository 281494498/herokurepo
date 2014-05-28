/**
 * Created by hanwen on 23.05.14.
 *
 * start to init the different Modules.
 *
 */

var zugzug = (function(){
    'use strict';
    var initModule = function($zugzug){
        zugzug.model.initModule();
        zugzug.shell.initModule($zugzug);
    };

    return { initModule : initModule};
}());