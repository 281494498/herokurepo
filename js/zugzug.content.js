/**
 * Created by hanwen on 27.05.14.
 */

/**
 * Created by hanwen on 25.05.14.
 */

zugzug.content = (function(){
    var content_html="";
    content_html += "                <div class=\"row \">";
    content_html += "                    <div class=\"content-search b col-md-4\">";
    content_html += "                       <div class=\"row\"><\/div>";
    content_html += "                       <div class=\"content-search-start b col-md-6\">start<\/div>";
    content_html += "                       <div class=\"content-search-end b col-md-6\">end<\/div>";
    content_html += "                     <\/div>";
    content_html += "                    <div class=\"content-post b col-md-4\">post<\/div>";
    content_html += "                    <div class=\"content-detail b col-md-4\">map";
    content_html += "  <form>";
    content_html += "	  <p>";
    content_html += "		<label for=\"username\">Start:<\/label>";
    content_html += "		<input type=\"text\" name=\"username\" id=\"username\">";
    content_html += "	  <\/p>";
    content_html += "	  <p>";
    content_html += "		<label for=\"password\">End: <\/label>";
    content_html += "		<input type=\"text\" name=\"password\" id=\"password\">";
    content_html += "	  <\/p>";
    content_html += "	  <p>";
    content_html += "		<input type=\"submit\" name=\"button\" id=\"button\" value=\"Submit\" >";
    content_html += "	  <\/p>";
    content_html += "  <\/form>";
    content_html += "<\/div>";

    content_html += "                <\/div>";
    content_html += "                <div class=\"row\">";
    content_html += "                    <div class=\"content-list b col-md-8\">list<\/div>";
    content_html += "                <\/div>";
    var configMap = {
            content_html :content_html,
            support_option:{
                login_open_time : true,
                login_close_time : true,
                set_post_anchor : true,
                set_search_start_anchor : true,
                set_search_end_anchor : true
            },

            login_open_time : 200,
            login_close_time : 100,
            set_post_anchor: null,
            set_search_anchor : null,
            set_search_start_anchor: null,
            set_search_end_anchor : null
        },

        stateMap = {
            position_type : 'close',    //TODO double seted
            open_height_px : 200,
            open_width_px : 300,
            px_per_em : 0
        },

        jqueryMap = {
            $container: null
        };

    var setJqueryMap, configModule, initModule, setPostPosition, onClickToggle,
        onTapStart, onTapEnd, onSearchComplete, onListchangeComplete;

//    ======================DOM method===============
    setJqueryMap = function($container){
        jqueryMap = {
            $container  : $container,
            $list       : $container.find('.content-list'),
            $search     : $container.find('.content-search'),
            $post       : $container.find('.content-post'),
            $detail     : $container.find('.content-detail'),
            $start      : $container.find('.content-search-start'),
            $end        : $container.find('.content-search-end')
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
    setPostPosition = function(position_type, callback){
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

        stateMap.position_type = position_type;
        jqueryMap.$detail.slideToggle(animate_time,function(){   //TODO
            if(callback){
                callback(jqueryMap.$container);
            }
        });
        return true;
    };

    onClickToggle = function(){
        var set_post_anchor = configMap.set_post_anchor;
        if(stateMap.position_type === 'open'){
            set_post_anchor('close');
        }
        else if(stateMap.position_type ==='close'){
            set_post_anchor('open');
        }
        return false;
    };

    onTapStart = function(){
        var city_name;
            city_name = prompt('please enter the start city');
//            zugzug.model.cities.search(city_name, null);  //TODO
        configMap.set_search_start_anchor(city_name);
//            jqueryMap.$list.text('waiting');
    };

    onTapEnd = function(){
//            city = zugzug.model.cities.get_start();
//        if(city.get_is_anon()){
        var city_name = prompt('please enter the end city');
        configMap.set_search_end_anchor(city_name);
//            zugzug.model.cities.search(null, city_name);  //TODO
//            jqueryMap.$list.text('waiting');
//        }
//        else{
//            zugzug.model.cities.logout();
//        }
    };

    onSearchComplete = function(event, result_map){
        console.dir(result_map);//exactly the same one
        var path_fragment = undefined;
        result_map.forEach(function(path, index, array){
//            if(index >0){
                path_fragment = $('<p/>')
                    .addClass()
                    .text(path.start + ' to ' +path.end + ' on ' + path.date)
                    .appendTo(jqueryMap.$list);
            console.log(path_fragment.text());
//            }
        });

        jqueryMap.$list.append(path_fragment);
    };

    onListchangeComplete = function(event, add_path){
        console.dir(add_path.path);
        var add_para = $('<p>')
            .addClass()
            .text(path.start + 'to' + path.end + 'on' + path.date);
        jqueryMap.$list.prepend(add_para);
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
        $container.append(configMap.content_html);    //TODO
        setJqueryMap($container);

        jqueryMap.$post.click(onClickToggle);
        stateMap.position_type = 'close';

        jqueryMap.$start.text('enter the start').click(onTapStart);
        jqueryMap.$end.text('enter the end').click(onTapEnd);

        $.gevent.subscribe(jqueryMap.$list, 'zugzug-search', onSearchComplete);
        $.gevent.subscribe(jqueryMap.$list, 'zugzug-listchange', onListchangeComplete);
        return true;
    };

    return {
        setPostPosition : setPostPosition,
        configModule : configModule,
        initModule : initModule
    }
}());