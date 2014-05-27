/*
 * zugzug.util.js
 * General JavaScript utilities
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * These are routines I have created, compiled, and updated
 * since 1998, with inspiration from around the web.
 *
 * MIT License
 *
*/

zugzug.util = (function () {
  var makeError, setConfigMap;

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error     = new Error();
    error.name    = name_text;
    error.message = msg_text;

    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * input_option    - map of key-values to set in config
  //   * support_option - map of allowable keys to set
  //   * config_option   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      input_option    = arg_map.input_option,
      support_option = arg_map.support_option,
      config_option   = arg_map.config_option,
      key_name, error;

    for ( key_name in input_option ){
      if ( input_option.hasOwnProperty( key_name ) ){
        if ( support_option.hasOwnProperty( key_name ) ){
          config_option[key_name] = input_option[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported, support variable is'
          );
          console.dir(support_option);
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  return {
    makeError    : makeError,
    setConfigMap : setConfigMap
  };
}());
