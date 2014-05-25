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
    main_html += "                <div class=\"row \">";
    main_html += "                    <div class=\"content-search b col-md-4\">search<\/div>";
    main_html += "                    <div class=\"content-post b col-md-4\">post<\/div>";
    main_html += "                    <div class=\"content-map b col-md-4\">map<\/div>";
    main_html += "                <\/div>";
    main_html += "                <div class=\"row\">";
    main_html += "                    <div class=\"content-list b col-md-8\">list<\/div>";
    main_html += "                <\/div>";
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
                login : { open  : true,  closed : true}
            }
       },
       stateMap = {
            anchor_map : {}
       },
       jqueryMap = {     };

    var setJqueryMap, initModule,
        copyAnchorMap, changeAnchorPart, onHashChange, setLoginAnchor;

//    =====================UTILITY======
    copyAnchorMap = function(){
        return $.extend(true,  {}, stateMap.anchor_map);
    };



//    ======================DOM=========
    setJqueryMap = function($container){
        jqueryMap = {
            $container  : $container,
            $acct       : $container.find('.acct')
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

//    toggleLogin = function(do_extend, callback){
//        var
//           ,
//            is_open = px_login_ht === configMap.
//            is_closed = px_login_ht ===configMap,
//            is sliding =
//    };

    onHashChange = function(){
        var
            anchor_map_previous = copyAnchorMap(),
            anchor_map_proposed,
            _s_login_previous, _s_login_proposed,
            s_login_proposed,
            is_login_ok = true;

        try{
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        }
        catch(error){
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }

        stateMap.anchor_map = anchor_map_proposed;

        //convenience vars
        _s_login_previous = anchor_map_previous._s_login;
        _s_login_proposed = anchor_map_proposed._s_login;

        //if anchor changed, magic happened here!
        if(! anchor_map_previous || _s_login_previous !== _s_login_proposed){
            s_login_proposed = anchor_map_proposed.login;
            switch (s_login_proposed){
                case 'open':
                    is_login_ok = zugzug.acct.setSliderPosition('open');
                    break;
                case 'close':
                    is_login_ok = zugzug.acct.setSliderPosition('close');
                    break;
                default :   //TODO
                    is_login_ok = true;
                    delete anchor_map_proposed.login;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }

        if(!is_login_ok){
            if(anchor_map_previous){
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            }
            else{
                delete anchor_map_proposed.login;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        return false;
    };

//    ===============CALLBACK===========

    setLoginAnchor = function(position_type){
      return changeAnchorPart({login : position_type});
    };

//    ===================================

    initModule = function($container){
        $container.html(configMap.main_html);
        setJqueryMap($container);

        zugzug.acct.configModule({
            set_login_anchor : setLoginAnchor

        });
        zugzug.acct.initModule(jqueryMap.$acct);

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