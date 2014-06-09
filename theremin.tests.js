describe("Theremin object methods", function() {
  describe("getVersion", function() {
    it("should return Theremin's version", function(){
      expect(Theremin.getVersion()).toBe("0.0.1");
    });
  });
});