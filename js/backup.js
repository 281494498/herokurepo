/**
 * Created by hanwen on 29.05.14.
 */

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
        $.gevent.publish('mgame-listchange', [arg_list]);   //TODO can't be tested locally
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
        var sio = isFakeData ? zugzug.fake.mockSio : mgame.data.getSio();
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