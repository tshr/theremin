describe("Theremin", function(){

  describe("object methods", function(){

    describe("getVersion", function(){
      it("returns version", function(){
        expect(Theremin.getVersion()).toBe("0.0.1");
      });
    });

    describe("getContext", function(){
      it("gets audio context or returns undefined if one is not set", function(){
        context = new AudioContext();
        expect(Theremin.getContext()).toBe(undefined);
        Theremin.setContext(context);
        expect(Theremin.getContext()).toBe(context);
      });
    });

    describe("setContext", function(){
      it("sets audio context and returns it", function(){
        context = new AudioContext();
        expect(Theremin.setContext(context)).toBe(context);
        expect(Theremin.getContext()).toBe(context);
      });
    });
  });
});