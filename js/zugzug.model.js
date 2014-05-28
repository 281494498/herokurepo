/**
 * Created by hanwen on 27.05.14.
 */

/*
 *
 * mgame.model.js
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
            stateMap.start = stateMap.start || start_city;
            stateMap.end = stateMap.end || end_city;
            _start = stateMap.start;
            _end = stateMap.end;
            console.log('start from : '+ _start + " to: " + _end );
            if(_start && _end){
                sio.on('searchpathCallback', completeSearchPath);

                sio.emit('searchpath', {
                    startCity   : _start,
                    endCity     : _end
                });
            }
        };

        completeSearchPath = function(){
//            var path_map = path_list[0];    //TODO here only set the first guy !!!!!!

            var path_list = zugzug.fake.getPathList(); // which is a array

            path_list.forEach(function(path, index, list){
                makePath({
                    id     : path._id,
                    start   : path.start,
                    end    : path.end,
                    date      : path.date,
                    member    : path.member,
                    cid     : path._id
                });
            });

            stateMap.path_db().each(function(path, index){
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

//    path = (function(){
//        var _publish_listchange, _update_list,
//        //this method to refresh the PEOPLE object when a new people list receiveed
//            _update_list = function(arg_list){
//                var  person_map, make_person_map, person,
//                    path_list = arg_list[0],
//                clearPathDB();
//
//
//
//                PERSON:
//                    for (var i=0; i < path_list.length; i++) {
//                        path_map = path_list[i];
//
//                        if (! person_map.name) {
//                            continue PERSON;
//                        }
//
//                        //if user defined, update css_map and skip reminder
//                        if (stateMap.user && stateMap.user.id === person_map._id) {
//                            stateMap.user.css_map = person_map.css_map;
//                            continue PERSON;
//                        }
//
//                        make_person_map = {
//                            cid		: person_map._id,
//                            css_map	: person_map.css_map,
//                            id		: person_map._id,
//                            name	: person_map.name
//                        };
//
//                        person = makePerson(make_person_map);
//
//                        //recursively check if chatee is online
//                        if (chatee && chatee.id === make_person_map.id) {
//                            is_chatee_online = true;
//                            chatee = person;
//                        };
//                    }
//
//                stateMap.people_db.sort('name');
//                //if chatee offline we unset the chatee and trigger 'mgame-setchatee'
//                if ( chatee && !is_chatee_online) {set_chatee('');};
//            };
//    }());

//    ======================================================
    chat = (function(){
        var
            _publish_listchange, _update_list, _leave_chat, join_chat,
            _publish_updatechat, get_chatee, send_msg, set_chatee,
            chatee = null, update_avatar;

        //this method to refresh the PEOPLE object when a new people list receiveed
        _update_list = function(arg_list){
            var  person_map, make_person_map, person,
                people_list = arg_list[0],
                is_chatee_online = false;
            clearPeopleDb();

            PERSON:
                for (var i=0; i < people_list.length; i++) {
                    person_map = people_list[i];

                    if (! person_map.name) {
                        continue PERSON;
                    }

                    //if user defined, update css_map and skip reminder
                    if (stateMap.user && stateMap.user.id === person_map._id) {
                        stateMap.user.css_map = person_map.css_map;
                        continue PERSON;
                    }

                    make_person_map = {
                        cid		: person_map._id,
                        css_map	: person_map.css_map,
                        id		: person_map._id,
                        name	: person_map.name
                    };

                    person = makePerson(make_person_map);

                    //recursively check if chatee is online
                    if (chatee && chatee.id === make_person_map.id) {
                        is_chatee_online = true;
                        chatee = person;
                    };
                }

            stateMap.people_db.sort('name');
            //if chatee offline we unset the chatee and trigger 'mgame-setchatee'
            if ( chatee && !is_chatee_online) {set_chatee('');};
        };
        //end update_list

        //this method to publish a global jquery event with people list as data
        _publish_listchange = function (arg_list){
            _update_list(arg_list);
            $.gevent.publish('mgame-listchange', [arg_list]);
        };

        _publish_updatechat = function(arg_list){
            var msg_map = arg_list[0];

            //set chatee when receive the msg.
            if (!chatee) { set_chatee(msg_map.sender_id);}
            else if (msg_map.sender_id !== stateMap.user.id
                && msg_map.sender_id !==chatee.id) {
                set_chatee(msg_map.sender_id);
            }

            $.gevent.publish('mgame-updatechat', [msg_map]);
        };
        //end chat (internal)

        _leave_chat = function(){
            var sio = isFakeData ? mgame.fake.mockSio : mgame.data.getSio();
            chatee = null;
            stateMap.is_connected = false;
            if (sio) { sio.emit('leavechat');}	//TODO
        };

        get_chatee = function(){ return chatee; };

        join_chat = function(){
            var sio;
            if (stateMap.is_connected) {return false;}

            if (stateMap.user.get_is_anon()) {
                console.warn('User must be defined befor joining chat');
                return false;
            }

            sio = isFakeData ? zugzug.fake.mockSio : zugzug.data.getSio();
            sio.on('listchange', _publish_listchange);
            console.log('joined'+ _publish_listchange);
            sio.on('updatechat', _publish_updatechat);
            stateMap.is_connected = true;
            return true;
        };

        send_msg = function(msg_text){
            var msg_map,
                sio = isFakeData ? mgame.fake.mockSio : mgame.data.getSio();	//TODO

            if (! sio) { return false; }
            if (!(stateMap.user && chatee) ) {return false;}

            msg_map = {
                dest_id		: chatee.id,
                dest_name	: chatee.name,
                sender_id	: stateMap.user.id,
                msg_text	: msg_text
            };

            //we published updatechat so we can show the out going msg.
            _publish_updatechat( [msg_map]);
            sio.emit('updatechat',msg_map);
            return true;
        };

        set_chatee =  function(person_id){
            var new_chatee;
            new_chatee = stateMap.people_cid_map[person_id];
            if (new_chatee) {
                if (chatee && chatee.id === new_chatee.id) {
                    return false;
                }
            }
            else{
                new_chatee = null;
            }
            $.gevent.publish(
                'mgame-setchatee',
                {old_chatee : chatee, new_chatee : new_chatee}
            );
            chatee = new_chatee;
            return true;
        };

        update_avatar = function(avatar_update_map){
            var sio = isFakeData ? mgame.fake.mockSio : mgame.data.getSio();
            if (sio) {
                sio.emit('updateavatar', avatar_update_map);
            }
        };

        return {
            _leave	: _leave_chat,
            join	: join_chat,

            get_chatee	: get_chatee,
            send_msg	: send_msg,
            set_chatee	: set_chatee,

            update_avatar : update_avatar
        };

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

        stateMap.city = stateMap.anon_city;
    };

    return {
        initModule	: initModule,
        cities		: cities,
        chat		: chat
    };
}());