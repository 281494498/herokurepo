/**
 * Created by hanwen on 25.05.14.
 */

zugzug.acct = (function(){
    var acct_html="";
    acct_html += "                    <li>home<\/li>";
    acct_html += "                    <li class=\"acct-button\">login<\/li>";
    acct_html += "                    <li>copyright<\/li>";
    acct_html += "                    <div class=\"acct-login b\"><form>form</form><\/div>";
    var configMap = {
            acct_html :acct_html,
            support_option:{
                login_open_time : true,
                login_close_time : true,
                set_info_anchor : true
            },

            login_open_time : 200,
            login_close_time : 100,
            set_info_anchor: null
        },

        stateMap = {
            position_type : 'close',    //TODO double seted
            open_height_px : 200,
            open_width_px : 300
        },

        jqueryMap = {
            $container: null
        };

    var setJqueryMap, configModule, initModule, setSliderPosition, onClickToggle;

//    ======================DOM method===============
    setJqueryMap = function($container){
      jqueryMap = {
          $container  : $container,
          $login      : $container.find('.acct-login'),
          $button      : $container.find('.acct-button'),
          $form       : $container.find('form')
          };
    };

//    ======================Event Handler=============
    setSliderPosition = function(position_type, callback){
        var height_px, animate_time;

        if(stateMap.position_type === position_type){
            return true;    //command successful
        }

        switch(position_type){
            case 'open' :
                height_px = stateMap.open_height_px;
                animate_time = configMap.login_open_time;
                break;
            case 'close' :
                height_px = 0;
                animate_time = configMap.login_close_time;
                break;
            default:
                return false;   //here return false means the animated is false in shell.js
        }

        stateMap.position_type = position_type;
        jqueryMap.$login.slideToggle(animate_time,function(){   //TODO
            if(callback){
                callback(jqueryMap.$container);
            }
        });
        return true;
    };

    onClickToggle = function(){
        var set_info_anchor = configMap.set_info_anchor;
        if(stateMap.position_type === 'open'){
            set_info_anchor('close');
        }
        else if(stateMap.position_type ==='close'){
            set_info_anchor('open');
        }
        return false;
    };

    configModule = function(input_map){
        zugzug.util.setConfigMap({
            input_option   : input_map,
            support_option : configMap.support_option,
            config_option  : configMap
        });
         return true;
     };

    initModule = function($container){
        $container.append(configMap.acct_html);    //TODO here is append instead of html
        setJqueryMap($container);

        jqueryMap.$button.click(onClickToggle);
        stateMap.position_type = 'close';
        return true;
    };

    return {
        setSliderPosition : setSliderPosition,
        configModule : configModule,
        initModule : initModule
    }
}());