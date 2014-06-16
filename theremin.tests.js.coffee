describe "Theremin", ->
  describe "object methods", ->
    describe "getVersion", ->
      it "returns version", ->
        expect(Theremin.getVersion()).toBe "0.0.1"

    describe "getContext", ->
      it "gets audio context or returns undefined if one is not set", ->
        context = new AudioContext()
        expect(Theremin.getContext()).toBe undefined
        Theremin.setContext context
        expect(Theremin.getContext()).toBe context

    describe "setContext", ->
      it "sets audio context and returns it", ->
        context = new AudioContext()
        expect(Theremin.setContext(context)).toBe context
        expect(Theremin.getContext()).toBe context

  describe "Player", ->
    player = new Theremin.Player()
    describe "Constructor", ->
      it "creates a new player object", ->
        expect(player.constructor).toBe Theremin.Player

      it "creates a new player object with accumulated_duration set to 0", ->
        expect(player.accumulated_duration).toBe 0

      it "creates a new player object with loop set to true if true is passed as /
      an options param and false if nothing or false is passed", ->
        expect(player.loop).toBe false
        player = new Theremin.Player(loop: true)
        expect(player.loop).toBe true
        player = new Theremin.Player(loop: false)
        expect(player.loop).toBe false

      it "creates a new player object and loads an audio buffer if one is passed /
      in as an option param", ->
        runs ->
          audio_buffer_url = "http://upload.wikimedia.org/wikipedia/en/f/fd/Beach_Boys-wouldn_t_it_be_nice.ogg"
          player = new Theremin.Player(buffer: audio_buffer_url)

        waitsFor (->
          player.buffer
        ), "Buffer failed to load", 5000
        runs ->
          expect(player.buffer.constructor).toBe AudioBuffer

    describe "#loadBuffer", ->
      it "loads an audio buffer", ->
        runs ->
          player.loadBuffer "http://upload.wikimedia.org/wikipedia/en/f/fd/Beach_Boys-wouldn_t_it_be_nice.ogg"

        waitsFor (->
          player.buffer
        ), "Buffer failed to load", 5000
        runs ->
          expect(player.buffer.constructor).toBe AudioBuffer

    describe "#play, #pause, and #jumpTo", ->
      beforeEach ->
        runs ->
          player.loadBuffer "http://upload.wikimedia.org/wikipedia/en/f/fd/Beach_Boys-wouldn_t_it_be_nice.ogg"

        waitsFor (->
          player.buffer
        ), "Buffer failed to load", 5000

      describe "#play", ->
        afterEach ->
          player.pause()

        it "throws an exception if a buffer is not loaded", ->
          new_player = new Theremin.Player()
          expect(->
            new_player.play()
          ).toThrow "No buffer loaded for this player"

        it "if loop is true it sets the accumulated duration to the modulo of /
        the accumulated duration over the buffer duration", ->
          runs ->
            player.loop = true
            player.accumulated_duration = 1000000
            player.play()
            expect(player.accumulated_duration).toBe player.accumulated_duration % player.buffer.duration

        it "if loop is false, the player is playing, and the accumulated duration /
        is greater than buffer duration the player is reset", ->
          runs ->
            player.loop = false
            player.accumulated_duration = 1000000
            player.play()
            expect(player.accumulated_duration).toBe 0

        it "if the player is not playing it creates a new source", ->
          player.source = null
          player.play()
          expect(player.source.constructor).toBe AudioBufferSourceNode

      describe "#pause", ->
        it "sets source to null", ->
          runs ->
            player.play()
            expect(player.source.constructor).toBe AudioBufferSourceNode
            player.pause()
            expect(player.source).toBe null

      describe "#jumpTo", ->
        it "sets accumulated_duration to seconds specified in params", ->
          runs ->
            player.jumpTo 5
            expect(player.accumulated_duration).toBe 5

        it "sets the source to null if the player is already playing", ->
          runs ->
            player.play()
            player.jumpTo 5
            expect(player.source).toBe null

        it "starts playing the player at the jumpTo point if play is set to true, /
        with a delay if delay is set", ->
          spyOn player, "play"
          runs ->
            player.jumpTo 5, true, 2
            expect(player.play).toHaveBeenCalledWith 2
