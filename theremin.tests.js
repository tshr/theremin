describe("Theremin", function(){

  describe("object methods", function(){

    describe("getVersion", function(){
      it("returns version", function(){
        expect(Theremin.getVersion()).toBe("0.0.1");
      });
    });

    describe("getContext", function(){
      it("gets audio context or returns undefined if one is not set", function(){
        var context = new AudioContext();
        expect(Theremin.getContext()).toBe(undefined);
        Theremin.setContext(context);
        expect(Theremin.getContext()).toBe(context);
      });
    });

    describe("setContext", function(){
      it("sets audio context and returns it", function(){
        var context = new AudioContext();
        expect(Theremin.setContext(context)).toBe(context);
        expect(Theremin.getContext()).toBe(context);
      });
    });
  });

  describe("Player", function(){

    var player = new Theremin.Player();

    describe("Constructor", function(){

      it("creates a new player object", function(){
        expect(player.constructor).toBe(Theremin.Player);
      });

      it("creates a new player object with accumulated_duration set to 0", function(){
        expect(player.accumulated_duration).toBe(0);
      });

      it("creates a new player object with loop set to true if true is passed as a param and false if nothing or false is passed", function(){
        expect(player.loop).toBe(false);

        player = new Theremin.Player(true);
        expect(player.loop).toBe(true);

        player = new Theremin.Player(false);
        expect(player.loop).toBe(false);
      });
    });

    describe("#loadBuffer", function() {
      it("loads an audio buffer", function() {

        runs(function() {
          player.loadBuffer("http://upload.wikimedia.org/wikipedia/en/f/fd/Beach_Boys-wouldn_t_it_be_nice.ogg");
        });

        waitsFor(function() {
          return player.buffer;
        }, "Buffer failed to load", 5000);

        runs(function() {
          expect(player.buffer.constructor).toBe(AudioBuffer);
        });
      });
    });

    describe("#play, #pause, and #jumpTo", function(){

      beforeEach(function() {
        runs(function() {
          player.loadBuffer("http://upload.wikimedia.org/wikipedia/en/f/fd/Beach_Boys-wouldn_t_it_be_nice.ogg");
        });

        waitsFor(function() {
          return player.buffer;
        }, "Buffer failed to load", 5000);
      });

      describe("#play", function() {

        afterEach(function() {
          player.pause();
        });

        it("throws an exception if a buffer is not loaded", function() {
          new_player = new Theremin.Player();
          expect(function(){ new_player.play(); }).toThrow("No buffer loaded for this player");
        });

        it("if loop is true it sets the accumulated duration to the modulo of the accumulated duration over the buffer duration", function() {
          runs(function() {
            player.loop = true;
            player.accumulated_duration = 1000000;
            player.play();
            expect(player.accumulated_duration).toBe(player.accumulated_duration % player.buffer.duration);
          });
        });

        it("if loop is false, the player is playing, and the accumulated duration is greater than buffer duration the player is reset", function() {
          runs(function() {
            player.loop = false;
            player.accumulated_duration = 1000000;
            player.play();
            expect(player.accumulated_duration).toBe(0);
          });
        });

        it("if the player is not playing it creates a new source", function() {
          player.source = null
          player.play();
          expect(player.source.constructor).toBe(AudioBufferSourceNode);
        });
      });

      describe("#pause", function() {

        it ("sets source to null", function() {
          runs(function() {
            player.play();
            expect(player.source.constructor).toBe(AudioBufferSourceNode);
            player.pause();
            expect(player.source).toBe(null);
          });
        });
      });

      describe("#jumpTo", function() {

        it ("sets accumulated_duration to seconds specified in params", function() {
          runs(function() {
            player.jumpTo(5)
            expect(player.accumulated_duration).toBe(5);
          });
        });

        it ("sets the source to null if the player is already playing", function() {
          runs(function() {
            player.play();
            player.jumpTo(5)
            expect(player.source).toBe(null);
          });
        });

        it ("starts playing the player at the jumpTo point if play is set to true, with a delay if delay is set", function() {
          spyOn(player, 'play');
          runs(function() {
            player.jumpTo(5, true, 2)
            expect(player.play).toHaveBeenCalledWith(2);
          });
        });
      });
    });
  });
});