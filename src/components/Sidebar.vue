<template>
  <div>
    <div class="play-buttons">
      <div class="play-buttons">
        <button
          id="new-game"
          v-on:click="this.newGame"
          class="btn btn-success"
          style="margin-right: 3px;"
        >New Game</button>
        <button
          id="pause"
          v-on:click="this.pauseToggle"
          class="btn btn-light"
          style="margin-left: 3px;"
          :disabled="status == 'Game Over'"
        >{{ statusButton }}</button>
      </div>
    </div>
    <div class="up-next">
      <h3>Up Next:</h3>
      <div class="next-brick-bg">
        <div class="next-brick-render" v-bind:class="{'lineNext': (upNext == 1),'squareNext': (upNext == 0),'tblockNext': (upNext == 2),'sblockNext': (upNext == 3),'zblockNext': (upNext == 4),'lblockNext': (upNext == 5),'jblockNext': (upNext == 6)}">
          <div
            class="block"
            v-for="block in this.upNextBlocks"
            v-bind:key="block.id"
            v-bind:class="{'active': (block.value > 0),'line': (block.value == 1),'square': (block.value == 7),'tblock': (block.value == 2),'sblock': (block.value == 3),'zblock': (block.value == 4),'lblock': (block.value == 5),'jblock': (block.value == 6)}"
          ></div>
        </div>
      </div>
    </div>
    <div class="score-board">
      <h3>Level: {{ level }}</h3>
      <h3>Lines: {{ popCount }}</h3>
      <h3>Score: {{ score }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      upNextBlocks: [{}]
    };
  },
  computed: mapState({
    status: "status",
    level: "level",
    popCount: "popCount",
    score: "score",
    upNext: "upNext",

    statusButton() {
      if (this.status == "Active") return "Pause Game"
      else if (this.status == "Paused") return "Resume Game"
      else if (this.status == "Game Over") return "Game Over"
      else {
        return "Start Game";
      }
    }
  }),
  watch: {
    upNext() {
      this.renderNextBrick();
    }
  },
  methods: {
    newGame() {
      this.$store.commit("newGame");
    },
    pauseToggle() {
      if (this.status == "Active") this.$store.commit("setStatus", "Paused");
      else {
        this.$store.commit("setStatus", "Active");
      }
    },
    renderNextBrick: function() {
      let nextBlocks = [];
      const next = this.upNext;

      if (next == 1) nextBlocks = this.lineUpNext();
      else if (next == 2) nextBlocks = this.tUpNext();
      else if (next == 3) nextBlocks = this.sUpNext();
      else if (next == 4) nextBlocks = this.zUpNext();
      else if (next == 5) nextBlocks = this.lUpNext();
      else if (next == 6) nextBlocks = this.jUpNext();
      else nextBlocks = this.squareUpNext();

      this.upNextBlocks = nextBlocks;
    },
    lineUpNext: function() {
      return [
        { id: 0, value: 1 },
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 }
      ];
    },
    tUpNext: function() {
      return [
        { id: 0, value: 0 },
        { id: 1, value: 2 },
        { id: 2, value: 0 },
        { id: 3, value: 2 },
        { id: 4, value: 2 },
        { id: 5, value: 2 }
      ];
    },
    sUpNext: function() {
      return [
        { id: 0, value: 0 },
        { id: 1, value: 3 },
        { id: 2, value: 3 },
        { id: 3, value: 3 },
        { id: 4, value: 3 },
        { id: 5, value: 0 }
      ];
    },
    zUpNext: function() {
      return [
        { id: 0, value: 4 },
        { id: 1, value: 4 },
        { id: 2, value: 0 },
        { id: 3, value: 0 },
        { id: 4, value: 4 },
        { id: 5, value: 4 }
      ];
    },
    lUpNext: function() {
      return [
        { id: 0, value: 5 },
        { id: 1, value: 0 },
        { id: 2, value: 5 },
        { id: 3, value: 0 },
        { id: 4, value: 5 },
        { id: 5, value: 5 }
      ];
    },
    jUpNext: function() {
      return [
        { id: 0, value: 0 },
        { id: 1, value: 6 },
        { id: 2, value: 0 },
        { id: 3, value: 6 },
        { id: 4, value: 6 },
        { id: 5, value: 6 }
      ];
    },
    squareUpNext: function() {
      return [
        { id: 0, value: 7 },
        { id: 1, value: 7 },
        { id: 2, value: 7 },
        { id: 3, value: 7 }
      ];
    }
  }
};
</script>

<style>
</style>
