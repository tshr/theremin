(function() {

  var root = this;

  // Set AudioContext to vendor version
  root.AudioContext = root.AudioContext || root.webkitAudioContext
                                        || root.mozAudioContext
                                        || root.oAudioContext
                                        || root.msAudioContext;

  if (!root.AudioContext) throw "The Web Audio API is not available in this environment";

  Theremin = root.Theremin = {};

})();