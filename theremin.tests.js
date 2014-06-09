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

    describe("Player constructor", function(){

      var player = new Theremin.Player();

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
  });
});