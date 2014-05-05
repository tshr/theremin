(function() {

  var root = this;
  root.Theremin = {}

  window.AudioContext = window.AudioContext || window.webkitAudioContext
                                            || window.mozAudioContext
                                            || window.oAudioContext
                                            || window.msAudioContext;

  if (!window.AudioContext) throw "The Web Audio API is not available in this environment"

}).call(this);