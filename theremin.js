(function() {

  var root = this;
  root.Theremin = {}

  window.AudioContext = window.AudioContext || window.webkitAudioContext
                                            || window.mozAudioContext
                                            || window.oAudioContext
                                            || window.msAudioContext;

}).call(this);