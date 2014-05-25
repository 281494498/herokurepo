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
                set_login_anchor : true
            },

            login_open_time : 200,
            login_close_time : 100,
            set_login_anchor: null
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

//    setPxSizes = function () {
//        var px_per_em, window_height_em, opened_height_em;
//
//        px_per_em = zugzug.util_b.getEmSize( jqueryMap.$slider.get(0) );
//        window_height_em = Math.floor(
//                ( jqueryMap.$window.height() / px_per_em ) + 0.5
//        );
//
//        opened_height_em
//            = window_height_em > configMap.window_height_min_em
//            ? configMap.slider_opened_em
//            : configMap.slider_opened_min_em;
//
//        stateMap.px_per_em        = px_per_em;
//        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
//        stateMap.slider_opened_px = opened_height_em * px_per_em;
//        jqueryMap.$sizer.css({
//            height : ( opened_height_em - 2 ) * px_per_em
//        });
//    };

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
                return false;
        }

        stateMap.position_type = '';
        jqueryMap.$login.toggle(animate_time,function(){   //TODO
            if(callback){
                callback(jqueryMap.$slider);
            }
        });
        return true;
    };

    onClickToggle = function(){
        var set_login_anchor = configMap.set_login_anchor;
        if(stateMap.position_type === 'open'){
            set_login_anchor('close');
        }
        else if(stateMap.position_type ==='close'){
            set_login_anchor('open');
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
        $container.append(configMap.acct_html);    //TODO
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