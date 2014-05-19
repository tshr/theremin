(function(){

  // Set AudioContext to vendor version
  this.AudioContext = this.AudioContext || this.webkitAudioContext
                                        || this.mozAudioContext
                                        || this.oAudioContext
                                        || this.msAudioContext;

  if (!this.AudioContext) throw "The Web Audio API is not available in this environment";

  // Create Theremin object and private variables
  var _ = this.Theremin = {};
  var version = "0.0.1";
  var context;

  var checkContext = function() {
    if (!context) throw "Theremin does not have a context, give Theremin an audio context by passing one to Theremin.setContext";
  };

  var getAjaxBufferPromise = function(url) {

    return new Promise(function(resolve, reject) {

      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        if (request.status == 200) {
          resolve(request.response);
        }
        else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = function() {
        reject(Error("Network Error"));
      };

      request.send();
    });
  };

  _.getVersion = function() {
    return version;
  };

  _.setContext = function(audio_context){
    return context = audio_context;
  };

  _.getContext = function(){
    return context;
  };

  _.playBuffer = function(buffer, options) {

    checkContext();

    options = typeof options !== 'undefined' ? options : {};
    var delay = typeof options.delay !== 'undefined' ? options.delay : 0;
    var offset = typeof options.offset !== 'undefined' ? options.offset : 0;
    var loop = typeof options.loop !== 'undefined' ? options.loop : false;
    var source = context.createBufferSource();

    source.buffer = buffer;
    source.loop = loop;
    source.connect(context.destination);
    source.start(delay, offset);
    return source;
  };

  _.getBuffer = function(url, buffer_object) {
    if(typeof Promise === "undefined") throw "Theremin unable to get buffer because your browser does not support Promises";

    getAjaxBufferPromise(url).then(function(response) {
      context.decodeAudioData(response, function(theBuffer){
        buffer_object.buffer = theBuffer;
      });
    }, function(error) {
      console.error("Failed!");
    });
  };
}());
