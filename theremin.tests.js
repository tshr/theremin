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

    describe("Player constructor", function(){

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
          return !!player.buffer;
        }, "Buffer failed to load", 10000);

        runs(function() {
          expect(player.buffer.constructor).toBe(AudioBuffer);
        });
      });
    });
  });
});