/**
 * Created by hanwen on 17.05.14.
 */

zugzug.shell =(function(){
    var main_html="";
    main_html += "<div class=\"zugzug\" id ='home'>";
    main_html += "        <div class =  'zugzug-wrapper b' >";
    main_html += "            <div class=\"masthead inner b\">";
    main_html += "                <div class=\"masthead-brand\">ZugZug<\/div>";
    main_html += "                <div id=\"masthead-nav\">nav<\/div>";
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
          main_html: main_html
       },
       stateMap = {

       },
       jqueryMap = {     };

    var setJqueryMap, initModule;

//    ===================================
    setJqueryMap = function($container){
        jqueryMap = {
            $container  : $container,
            $acct       : $container.find('#masthead-nav')
        };

    };

//    ===================================

    initModule = function($container){
        $container.html(configMap.main_html);
        setJqueryMap($container);

        zugzug.acct.configModule();
        zugzug.acct.initModule(jqueryMap.$acct);
    };

//    ===================================
    return{initModule : initModule};
}());