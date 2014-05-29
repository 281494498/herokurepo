/**
 * Created by hanwen on 27.05.14.
 */

/*
 *
 * zugzug.model.js
 * Model module for SPA
 *
 */

/*jslint				browser : true,		continue	: true,
 devel	: true,		indent	: 2,		maxerr		: 50,
 newcap	: true,		nomen	: true,		plusplus	: true,
 regexp	: true,		sloppy	: true,		vars		: false,
 white	: true
 */

/* global TAFFY, $, mgame */

zugzug.model = (function(){

    'use strict';
    var
        configMap = { anon_id : 'a0' },
        stateMap	= {
            anon_city		: null,
            city_cid_map	: {},   //TODO what is the use of it
            city_db		: TAFFY(),
            cid_serial		: 0,
            city            : null,
            city_start		: null,
            city_end        : null,
            search_map      : null,

            path_db     : TAFFY(),
            path_cid_map	: {}
//            is_connected	: false
        },

        isFakeData = true,		// TODO changed to false now!!!!!!!!!!
        cityProto, makeCity, makePath, cities, initModule,
        makeCid, clearCityDb, completeLogin, removeCity, completePath,
        clearPathDB,
        chat, path
        ;

// 	The people object API
// -------------------------
//	public method include
    // * get_user()
    // * get_db()
    // * get_by_cid(<client_id>)
    // * Logout()

//Jquery global custom events include:
    // * mgame-login
    // * mgame-logout

// Each person is represented by a person object
    // * get_is_user()
    // * get_is_anon()

    cityProto = {
        get_is_city	: function(){
            return this.cid === stateMap.city.cid;
        },
        get_is_anon : function(){
            return this.cid === stateMap.anon_city.cid;
        }
    };

    makeCid = function(){
        return 'c' + String(stateMap.cid_serial++ );
    };

    clearCityDb = function(){   //TODO When to call it?
        var city = stateMap.city;
        stateMap.city_db = TAFFY();	//clear it.
        stateMap.city_cid_map = {};
        if (user) {	//initial db with the only user. what about cid_serial?
            stateMap.city_db.insert(user);
            stateMap.city_cid_map[user.cid] = user;
        }
    };

    makeCity = function(city_map){
        var city,
            cid = city_map.cid,
            state = city_map.state,
            id = city_map.id,
            name = city_map.name;

        if( cid === undefined|| !name){
            throw 'client id and name required';
        }

        //create new in server
        city		= Object.create(cityProto);
        city.cid  = cid;
        city.name = name;
        city.state = state;
        if(id){ //may not have id in city_map
            city.id = id;
        }

        stateMap.city_cid_map[cid] = city;  //TODOs
        stateMap.city_db.insert(city);
        return city;
    };

    makePath = function(path_map){
        var path,
            cid = path_map.cid,
            start = path_map.start,
            id = path_map.id,
            end = path_map.end,
            date = path_map.date,
            member = path_map.member;

        if( cid === undefined|| !start ||!end){
            throw 'client id and name required';
        }

        //create new in server
        path		= Object.create(cityProto);
        path.cid  = cid;
        path.name = name;
        path.start = start;
        path.end = end;
        path.date = date;
        path.member =member;

        if(id){ //may not have id in city_map
            path.id = id;
        }

//        stateMap.path_cid_map[cid] = city;  //TODOs
        stateMap.path_db.insert(path);
        return path;
    };
//
//    removePerson = function(person){
//        if ( !person) { return false; }
//        //can't remove anonymous person
//        if (person.id === configMap.anon_id) { return false; }
//
//        stateMap.people_db({ cid : person.cid}).remove();
//        if (person.cid) {
//            delete stateMap.people_cid_map[ person.cid ];
//        }
//
//        return true;
//    };
    clearPathDB = function(){
        stateMap.path_db = TAFFY();
        stateMap.path_cid_map = {};
    };

    //a people object give two quering method.
    cities = (function() {
        var get_by_cid, get_db, get_city, login, logout, get_start, get_end, search, completeSearchPath;

        get_by_cid = function(cid){
            return stateMap.city_cid_map[ cid ];
        };

        get_db = function(){ return stateMap.city_db; };

        get_city = function(){ return stateMap.city ;};

        get_start = function(){return stateMap.city_start};

        get_end = function(){return stateMap.city_end};

//        login = function(login_name){
//            var sio = isFakeData? zugzug.fake.mockSio : zugzug.data.getSio(); //TODO
//
//            stateMap.user = makePerson({
//                cid		: makeCid(),
//                css_map	: {top:25,left:25,'background-color':'#8f8'},
//                name	: login_name,
//                state   : null
//            });
//
//            sio.on('addcityCallback', completeLogin);
//
//            sio.emit('addcity', {
//                cid		: stateMap.user.cid,
//                css_map	: stateMap.user.css_map,
//                name	: stateMap.user.name
//            });
//        };

        search = function(start_city, end_city){
            var sio = isFakeData? zugzug.fake.mockSio : zugzug.data.getSio(); //TODO
            var _start, _end;

            _start = stateMap.start;
            _end = stateMap.end;    // TODO add the judgement on invalid search city

            if(start_city ){
                stateMap.start = start_city;
            }

            if(end_city ){
                stateMap.end = end_city;
            }

            console.log('start from : '+ stateMap.start + " to: " + stateMap.end );
            if(stateMap.start && stateMap.end && (stateMap.start !== _start || stateMap.end!== _end)){
                sio.on('searchpathCallback', completeSearchPath);

                sio.emit('searchpath', {        //TODO should be set in server
                    startCity   : stateMap.start,
                    endCity     : stateMap.end
                });

                stateMap.search_map = { //todo maybe removed
                    start : stateMap.start,
                    end   : stateMap.end
                };
            }
            return true ; //TODO
        };

        completeSearchPath = function(){
//            var path_map = path_list[0];    //TODO here only set the first guy !!!!!!

            var path_list = zugzug.fake.getPathList(); // which is a array

            path_list.forEach(function(path){
                makePath({
                    id     : path._id,
                    start   : path.start,
                    end    : path.end,
                    date      : path.date,
                    member    : path.member,
                    cid     : path._id
                });
            });

            stateMap.path_db().each(function(path){
                console.dir(path);
            });
            //here must be array, and first one is reserved by event, start from 1.
            $.gevent.publish('zugzug-search', [path_list]);
        };
//    completeLogin = function(user_list){
//        var user_map = user_list[0];
//        //change to current user from anonymous
//        delete stateMap.people_cid_map[ user_map.cid ];//why delete it here?
//        //update current user information
//        stateMap.user.cid		= user_map._id;
//        stateMap.user.id		= user_map._id;
//        stateMap.user.css_map	= user_map.css_map;
//        stateMap.people_cid_map[user_map._id] = stateMap.user;
//
//        //automaticllly join the chat room
//        chat.join();
//
//        //when we add chat, we should join here
//        $.gevent.publish('mgame-login', [stateMap.user]);
//    };
        logout = function(){
            var user = stateMap.user;
            //when we add chat, we should leave the chatroom here

            chat._leave();
            stateMap.user = stateMap.anon_user;
            clearPeopleDb();

            $.gevent.publish('mgame-logout', [user]);
        };

        return {
            get_by_cid	: get_by_cid,
            get_db		: get_db,
//            get_user	: get_user,
            get_start   : get_start,
            get_end     : get_end,
//            login		: login,
            logout		: logout,
            search      : search
        };
    }());

// 	The Chat object API
// ----------------------

    path = (function(){
        var _publish_listchange, _update_list, addPath;
        //this method to refresh the PEOPLE object when a new people list receiveed

//      decide whether to add the path to the list
        addPath = function(arg_list){
            var path_list = arg_list[0];

            if(stateMap.search_map === null){
                _update_list(path_list);
            }
            else if(stateMap.search_map.start == path_list.start &&
                    stateMap.search_map.end   == path_list.end){
                _update_list(path_list);
            }
        };

        _update_list = function(arg_list){
            var  person_map, make_path_map, person;

            clearPathDB();

            arg_list.forEach(function(path, index, list) {
                if (!path.start || !path.end) {
                    return;
                }

                make_path_map = {
                    id: path._id,
                    start: path.start,
                    end: path.end,
                    date: path.date,
                    member: path.member,
                    cid: path._id
                };
            });

        };

        _publish_listchange = function (arg_list){
            _update_list(arg_list);
            $.gevent.publish('zugzug-listchange', [arg_list]);
        };



        return {
            addPath : addPath
        }
    }());




    initModule = function(){
        var city_list;

        //initialize anonymous person.
//        stateMap.anon_city = makeCity({
//            cid		: configMap.anon_id,
//            id		: configMap.anon_id,
//            name	: 'anonymous'
//        });

        if(isFakeData){
            city_list = zugzug.fake.getCityList();
            city_list.forEach(function(city, index, list){
                makeCity({
                    cid     : city._id,
                    state   : city.state,
                    name    : city.name,
                    id      : city._id
                });
            });
        }

        var sio = isFakeData ? zugzug.fake.mockSio : mgame.data.getSio();
        sio.on('addpathCallback', path.addPath); //TODO

        stateMap.city = stateMap.anon_city;
    };

    return {
        initModule	: initModule,
        cities		: cities,
        chat		: chat
    };
}());