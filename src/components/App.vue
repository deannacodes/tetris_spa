<template>
  <div id="app">
    <div class="container">
      <h1 class="text-center">T E T R I S</h1>

      <div id="game-box" class="row align-items-center justify-content-center">
        <div class="col-md-4 align-items-baseline justify-content-center text-left">
          <div class="info">
            <high-scores></high-scores>
            <h5>Controls:</h5>
            <ul>
              <li>Down, Left and Right Arrows: Move</li>
              <li>Shift or A: Rotate Left</li>
              <li>Space or D: Rotate Right</li>
            </ul>
          </div>
          <p class="footnote">
            This is just a personal project. I do not own, nor am I affiliated with Tetris. Music provided under the Creative Commons
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0/deed.en"
              target="_blank"
            >Attribution-Share Alike 3.0 Unported</a> license.
          </p>
        </div>

        <div
          class="col-md-4 align-items-center justify-content-center text-center"
          style="padding-top:20px;"
        >
          <game></game>
        </div>

        <div class="col-md-4 align-self-start text-center">
          <sidebar></sidebar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Game from "./Game.vue";
import Sidebar from "./Sidebar.vue";
import HighScores from "./HighScores.vue";
import { mapState } from "vuex";

export default {
  name: "Tetris",
  data() {
    return {
      soundFile: null
    };
  },
  computed: mapState({
    sound: "sound"
  }),
 watch: {
    sound() {      
      if (this.soundFile == null) {
        var sounds = require.context("../assets/", false, /\.ogg$/);
        this.soundFile = new Audio(sounds("./theme.ogg"));
        this.soundFile.addEventListener('ended', function() {
          this.play();
        }, false);
      }
      if(this.sound) {
        this.soundFile.play()
      } else {
        this.soundFile.pause()
      }
    }
  },
  components: {
    Game,
    Sidebar,
    HighScores
  }
};
</script>

<style>
</style>



