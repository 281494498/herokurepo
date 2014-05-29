/**
 * Created by hanwen on 17.05.14.
 */

zugzug.shell =(function(){
    var main_html="";
    main_html += "<div class=\"zugzug\" id ='home'>";
    main_html += "        <div class =  'zugzug-wrapper b' >";
    main_html += "            <div class=\"masthead b\">";
    main_html += "                <div class=\"masthead-brand\">ZugZug<\/div>";
    main_html += "                <div class=\"acct b\">acct<\/div>";
    main_html += "            <\/div>";
    main_html += "";
    main_html += "            <div class=\"content b container\">content";
    main_html += "            <\/div>";
    main_html += "";
    main_html += "            <div class = 'mastfoot inner' id = 'copyright' >";
    main_html += "                <span class=\"glyphicon glyphicon-copyright-mark\"><\/span>";
    main_html += "                Made by <a href=\"https:\/\/github.com\/281494498\">Hanwen Cheng<\/a> 2014";
    main_html += "            <\/div>";
    main_html += "        <\/div>";
    main_html += "<\/div>";
    //TODO
    var configMap = {
            main_html: main_html,
            anchor_schema_map : {
                info : { open : true,  close : true},
                post : { open : true,  close : true},
//                search : true,
                start : true,
                end  : true
            }
       },
       stateMap = {
            anchor_map : {}
       },
       jqueryMap = {     };

    var setJqueryMap, initModule,
        copyAnchorMap, changeAnchorPart, onHashChange,
        setInfoAnchor, setPostAnchor, setSearchStartAnchor, setSearchEndAnchor;

//    =====================UTILITY======
    copyAnchorMap = function(){
        return $.extend(true,  {}, stateMap.anchor_map);
    };



//    ======================DOM=========
    setJqueryMap = function($container){
        jqueryMap = {
            $container  : $container,
            $acct       : $container.find('.acct'),
            $content    : $container.find('.content')
        };

    };

//    ===============EVENT HANDLER=======

    changeAnchorPart = function(arg_map){
        var
            anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        //begin merge changes
        LOOPKEY :
            for(key_name in arg_map){
                if(arg_map.hasOwnProperty(key_name)){ //in case of conflict

                    if(key_name.indexOf('_') === 0 ){continue LOOPKEY;}  //TODO
                    anchor_map_revise[key_name] = arg_map[key_name];

                    key_name_dep = '_'+key_name;
                    if(arg_map[key_name_dep]){
                        anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                    }
                    else{
                        delete anchor_map_revise[key_name_dep];
                        delete anchor_map_revise['_s'+key_name_dep]
                    }
                }
            }

        try{
            $.uriAnchor.setAnchor(anchor_map_revise);
        }
        catch (error){
            //replace uri with existing state
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true); //true means don't save wrong state history
            bool_return = false;
        }

        return bool_return; //TODO
    };

    onHashChange = function(){
        var
            anchor_map_previous = copyAnchorMap(),
            anchor_map_now, is_animated = true,

            _s_info_previous, _s_info_proposed, s_info_proposed,

            _s_post_previous, _s_post_proposed, s_post_proposed,

            _s_start_previous, _s_start_proposed, s_start_proposed,

            _s_end_previous, _s_end_proposed, s_end_proposed;

        try{
            anchor_map_now = $.uriAnchor.makeAnchorMap();
        }
        catch(error){
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }

        stateMap.anchor_map = anchor_map_now;

        //convenience vars
        _s_info_previous = anchor_map_previous._s_info;
        _s_info_proposed = anchor_map_now._s_info;
        _s_post_previous = anchor_map_previous._s_post;
        _s_post_proposed = anchor_map_now._s_post;
        _s_start_previous = anchor_map_previous._s_start;
        _s_start_proposed = anchor_map_now._s_start;
        _s_end_previous = anchor_map_previous._s_end;
        _s_end_proposed = anchor_map_now._s_end;

        //if anchor changed, magic happened here!
        if(! anchor_map_previous || _s_info_previous !== _s_info_proposed){
            s_info_proposed = anchor_map_now.info;
            switch (s_info_proposed){
                case 'open':
                    is_animated = zugzug.acct.setSliderPosition('open');
                    break;
                case 'close':
                    is_animated = zugzug.acct.setSliderPosition('close');
                    break;
                default :   //TODO
                    is_animated = true;
                    delete anchor_map_now.info;
                    $.uriAnchor.setAnchor(anchor_map_now, null, true);
            }
        }

        if(! anchor_map_previous || _s_post_previous !== _s_post_proposed){
            s_post_proposed = anchor_map_now.post;
            switch (s_post_proposed){
                case 'open':
                    is_animated = zugzug.content.setPostPosition('open');
                    break;
                case 'close':
                    is_animated = zugzug.content.setPostPosition('close');
                    break;
                default :   //TODO
                    is_animated = true;
                    delete anchor_map_now.post;
                    $.uriAnchor.setAnchor(anchor_map_now, null, true);
            }
        }

        if(! anchor_map_previous || _s_start_previous !== _s_start_proposed) {
            s_start_proposed = anchor_map_now.start;
            if (s_start_proposed) {
                is_animated = zugzug.model.cities.search(s_start_proposed, null);
            }
            else {
                is_animated = true;
                delete anchor_map_now.start;
                $.uriAnchor.setAnchor(anchor_map_now, null, true);
            }
        }

        if(! anchor_map_previous || _s_end_previous !== _s_end_proposed) {
            s_end_proposed = anchor_map_now.end;
            if (s_end_proposed) {
                is_animated = zugzug.model.cities.search(null, s_end_proposed);
            }
            else {
                is_animated = true;
                delete anchor_map_now.end;
                $.uriAnchor.setAnchor(anchor_map_now, null, true);
            }
        }

        if(!is_animated){
            if(anchor_map_previous){
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            }
            // if previous not exist then turn to default page(index)
            else{
                delete anchor_map_now.info;
                delete anchor_map_now.post;
                $.uriAnchor.setAnchor(anchor_map_now, null, true);
            }
        }
        return false;
    };

//    ===============CALLBACK===========

    setInfoAnchor = function(position_type){
      return changeAnchorPart({
          info : position_type
      });
    };

    setPostAnchor = function(position_type){
        return changeAnchorPart({post: position_type});
    };

    setSearchStartAnchor = function(start_city){
        if(start_city){
            return changeAnchorPart({start :  start_city})
        }
    };

    setSearchEndAnchor = function(end_city){
        if(end_city){
            return changeAnchorPart({end :  end_city})
        }
    };
//    ===================================

    initModule = function($container){
        $container.html(configMap.main_html);
        setJqueryMap($container);

        zugzug.acct.configModule({
            set_info_anchor : setInfoAnchor
        });
        zugzug.acct.initModule(jqueryMap.$acct);

        zugzug.content.configModule({
            set_post_anchor : setPostAnchor,
            set_search_start_anchor : setSearchStartAnchor,
            set_search_end_anchor : setSearchEndAnchor
        });

        zugzug.content.initModule(jqueryMap.$content);

        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });

        $(window)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');
    };

//    ===================================
    return{initModule : initModule};
}());