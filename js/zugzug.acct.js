/**
 * Created by hanwen on 25.05.14.
 */

zugzug.acct = (function(){
    var acct_html="";
    acct_html += "                <div class=\"masthead-nav b nav\">nav2";
    acct_html += "                    <div class=\"masthead-nav-login b\">login<\/div>";
    acct_html += "                <\/div>";
    var configMap = {
            acct_html :acct_html,
            support_option:{}
        },

        stateMap = {

        },

        jqueryMap = {
            $container: null
        };

    var setJqueryMap, configModule, initModule;

//    ======================DOM method===============
    setJqueryMap = function($container){
      jqueryMap = {
          $container : $container
          };
    };

//    ======================Event Handler=============
    configModule = function(){
        zugzug.util.setConfigMap({
//            input_option   : input_map,
            support_option : configMap.settable_map,
            config_option  : configMap
        });
         return true;
     };

    initModule = function($container){
        $container.html(configMap.acct_html);    //TODO
        setJqueryMap($container);
        return true;
    };

    return {
        configModule : configModule,
        initModule : initModule
    }
}());