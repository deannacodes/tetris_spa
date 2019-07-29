<template>
  <div class="game-container">
    <div
      class="block"
      v-for="block in blocks"
      v-bind:key="block.id"
      v-bind:class="{'active': (block.value > 0),'line': (block.value == 1),'square': (block.value == 7),'tblock': (block.value == 2),'sblock': (block.value == 3),'zblock': (block.value == 4),'lblock': (block.value == 5),'jblock': (block.value == 6)}"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    blocks: "blocks",
    status: "status",
    upNext: "upNext",
    interval: "interval",
    activePos: "activePos",
    currentBlock: "currentBlock",
    currentBlockType: "currentBlockType",
    fallingSpeed: "fallingSpeed"
  }),
  watch: {
    status(newStatus, oldStatus) {
      if (oldStatus == "Start" || newStats == "Active") {
        this.startGame();
      } 
    }
  },
  methods: {
    startGame: function() {
      this.nextBrick();
    },

    nextBrick: function() {
      let next = this.upNext;
      if (next == null) {
        next = Math.floor(Math.random() * 7);
        this.$store.commit("setUpNext", next);
      }
      switch (next) {
        case 1:
          this.lineBlock();
          break;
        case 2:
          this.tBlock();
          break;
        case 3:
          this.sBlock();
          break;
        case 4:
          this.zBlock();
          break;
        case 5:
          this.lBlock();
          break;
        case 6:
          this.jBlock();
          break;
        default:
          this.squareBlock();
      }

      next = Math.floor(Math.random() * 7);
      this.$store.commit("setUpNext", next);
      if (next == 0) next = 7;

      //this.renderNextBrick()
    },

    fallingBlocks: function(pos, type) {
      this.$store.commit("incrementCurrentBlock");
      this.$store.commit("setCurrentBlockType", type);
      this.updateBlocks(pos);

      if (!this.canMove("d")) {
        this.$store.commit("clearStateInterval");
        this.$store.commit("setStatus", "Game Over")
        return;
      }

      const self = this;
      if (this.interval == null) {
        const newInterval = setInterval(function() {
          if (self.status != "Paused") {
            if (self.canMove("d")) {
              self.moveBlock("d");
            } else {
              clearInterval(this.interval);
              this.interval = null;
              self.popRow();
              self.nextBrick();
            }
          }
        }, this.fallingSpeed);
        this.$store.commit("setStateInterval", newInterval);
      }
    },

    canMove: function(dir, pos = this.activePos) {
      if (this.status != "Active") return false;

      let blocks = this.blocks;
      for (let i = 0; i < 4; i++) {
        if (dir === "d") {
          const nextBlock = blocks[pos[i] + 10];
          if (
            pos[i] + 10 >= 200 ||
            (nextBlock.value > 0 && nextBlock.block != this.currentBlock)
          ) {
            return false;
          }
        } else if (dir === "l") {
          const nextBlock = blocks[pos[i] - 1];
          if (
            (pos[i] - 1) % 10 == 9 ||
            (nextBlock.value > 0 && nextBlock.block != this.currentBlock)
          ) {
            return false;
          }
        } else if (dir === "r") {
          const nextBlock = blocks[pos[i] + 1];
          if (
            (pos[i] + 1) % 10 == 0 ||
            (nextBlock.value > 0 && nextBlock.block != this.currentBlock)
          ) {
            return false;
          }
        } else if (dir === "rl" || dir === "rr") {
          const nextBlock = blocks[pos[i]];
          if (nextBlock.value > 0 && nextBlock.block != this.currentBlock) {
            return false;
          }
        }
      }
      return true;
    },

    moveBlock: function(dir) {
      let amount = 1;
      switch (dir) {
        case "d":
          amount = 10;
          break;
        case "l":
          amount = -1;
          break;
        default:
          amount = 1;
      }

      if (this.canMove(dir)) {
        let blocks1 = this.blocks;
        let pos = this.activePos;

        //clear previous blocks
        for (let i = 0; i < 4; i++) {
          let thisBlock = blocks1[pos[i]];
          thisBlock.value = 0;
          thisBlock.block = 0;
          pos[i] += amount;
        }
        //shade new ones
        for (let i = 0; i < 4; i++) {
          let thisBlock = blocks1[pos[i]];
          thisBlock.value = this.getTypeVal(this.currentBlockType);
          thisBlock.block = this.currentBlock;
        }
        this.$store.commit("setBlocks", blocks1);
        this.updateBlocks(pos);
      }
    },

    rotateBlock: function(dir, newPos) {
      if (this.canMove(dir, newPos)) {
        let blocks = this.blocks;
        let pos = this.activePos;
        for (let i = 0; i < 4; i++) {
          let thisBlock = blocks[pos[i]];
          thisBlock.value = 0;
          thisBlock.block = 0;
        }
        for (let i = 0; i < 4; i++) {
          let thisBlock = blocks[newPos[i]];
          thisBlock.value = this.getTypeVal(this.currentBlockType);
          thisBlock.block = this.currentBlock;
        }
        this.$store.commit("setBlocks", blocks);
        this.updateBlocks(newPos);
      }
    },

    updateBlocks: function(pos) {
      this.$store.commit("setActivePos", pos);
      this.$store.commit("setBlocksValuesOnActivePos");
    },

    popRow: function() {

      let multiplier = 0;
      let blocks = this.blocks
      for (let j = 0; j < 20; j++) {
        let pop = true;
        for (let i = 0; i < 10; i++) {
          const check = j * 10 + i;

          if (blocks[check].value == 0) {
            pop = false;
            break;
          }
        }

        if (pop == true) {
          this.$store.commit("incrementPopCount");
          multiplier++;

          for (let i = (j + 1) * 10 - 1; i > 9; i--) {
            blocks[i].block = blocks[i - 10].block;
            blocks[i].value = blocks[i - 10].value;
          }

          for (let i = 9; i >= 0; i--) {
            blocks[i].block = 0;
            blocks[i].value = 0;
          }

          this.$store.commit("levelUp");
          this.$store.commit("setBlocks", blocks);
        }
      }

      this.$store.commit("setScore", multiplier);
    },

    getTypeVal: function(type) {
      const currentBlockType = this.currentBlockType;
      if (currentBlockType === "line") return 1;
      else if (currentBlockType === "t") return 2;
      else if (currentBlockType === "s") return 3;
      else if (currentBlockType === "z") return 4;
      else if (currentBlockType === "l") return 5;
      else if (currentBlockType === "j") return 6;
      else return 7;
    },

    lineBlock: function() {
      this.fallingBlocks([3, 4, 5, 6], "line");
    },

    squareBlock: function() {
      this.fallingBlocks([4, 5, 14, 15], "square");
    },

    tBlock: function() {
      this.fallingBlocks([4, 5, 15, 6], "t");
    },

    sBlock: function() {
      this.fallingBlocks([14, 15, 5, 6], "s");
    },

    zBlock: function() {
      this.fallingBlocks([4, 5, 15, 16], "z");
    },

    lBlock: function() {
      this.fallingBlocks([4, 14, 24, 25], "l");
    },

    jBlock: function() {
      this.fallingBlocks([4, 14, 24, 23], "j");
    },

    left: function() {
      if (this.activePos != null) this.moveBlock("l");
    },

    right: function() {
      if (this.activePos != null) this.moveBlock("r");
    },

    down: function() {
      if (this.activePos != null) this.moveBlock("d");
    },

    rotatel: function() {
      let newPos = null;
      const currentBlockType = this.currentBlockType;
      if (currentBlockType === "line") newPos = this.rotateLinePos();
      else if (currentBlockType === "t") newPos = this.rotateTPosL();
      else if (currentBlockType === "s") newPos = this.rotateSPos();
      else if (currentBlockType === "z") newPos = this.rotateZPos();
      else if (currentBlockType === "l") newPos = this.rotateLPosL();
      else if (currentBlockType === "j") newPos = this.rotateJPosL();
      if (this.canMove("rl", newPos)) this.rotateBlock("rl", newPos);
    },

    rotater: function() {
      let newPos = null;
      const currentBlockType = this.currentBlockType;
      if (currentBlockType === "line") newPos = this.rotateLinePos();
      else if (currentBlockType === "t") newPos = this.rotateTPosR();
      else if (currentBlockType === "s") newPos = this.rotateSPos();
      else if (currentBlockType === "z") newPos = this.rotateZPos();
      else if (currentBlockType === "l") newPos = this.rotateLPosR();
      else if (currentBlockType === "j") newPos = this.rotateJPosR();
      if (this.canMove("rr", newPos)) this.rotateBlock("rr", newPos);
    },

    rotateLinePos: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 == pos[1]) {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] - 20 + 2;
      } else {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] + 20 - 2;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateTPosL: function() {
      let newPos = [0, 0, 0, 0];
      const pos = this.activePos;
      if (pos[0] + 10 + 1 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] - 10 - 1;
      } else if (pos[0] - 10 + 1 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] + 10 - 1;
      } else if (pos[0] - 10 - 1 == pos[2]) {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] + 10 + 1;
      } else if (pos[0] + 10 - 1 == pos[2]) {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] - 10 + 1;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateTPosR: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (this.activePos[0] + 10 + 1 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] + 10 - 1;
      } else if (pos[0] + 10 - 1 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] - 10 - 1;
      } else if (pos[0] - 10 - 1 == pos[2]) {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] - 10 + 1;
      } else if (pos[0] - 10 + 1 == pos[2]) {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] + 10 + 1;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateSPos: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] - 10 + 1 == pos[2]) {
        newPos[0] = pos[0] + 2;
        newPos[1] = pos[1] - 10 + 1;
        newPos[2] = pos[2];
        newPos[3] = pos[3] - 10 - 1;
      } else {
        newPos[0] = pos[0] - 2;
        newPos[1] = pos[1] + 10 - 1;
        newPos[2] = pos[2];
        newPos[3] = pos[3] + 10 + 1;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateZPos: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 + 1 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] - 2;
      } else {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] + 2;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateLPosL: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 + 10 == pos[2]) {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] - 10 - 10;
      } else if (pos[0] + 2 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] - 2;
      } else if (pos[0] - 10 - 10 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] + 10 + 10;
      } else {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] + 2;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateLPosR: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 + 10 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] - 2;
      } else if (pos[0] + 2 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] + 10 + 10;
      } else if (pos[0] - 10 - 10 == pos[2]) {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] + 2;
      } else {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] - 10 - 10;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateJPosL: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 + 10 == pos[2]) {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] + 2;
      } else if (pos[0] + 2 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] - 10 - 10;
      } else if (pos[0] - 10 - 10 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] - 2;
      } else {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] + 10 + 10;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    rotateJPosR: function() {
      const pos = this.activePos;
      let newPos = [0, 0, 0, 0];
      if (pos[0] + 10 + 10 == pos[2]) {
        newPos[0] = pos[0] + 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 - 1;
        newPos[3] = pos[3] - 10 - 10;
      } else if (pos[0] + 2 == pos[2]) {
        newPos[0] = pos[0] - 10 + 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 - 1;
        newPos[3] = pos[3] - 2;
      } else if (pos[0] - 10 - 10 == pos[2]) {
        newPos[0] = pos[0] - 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] + 10 + 1;
        newPos[3] = pos[3] + 10 + 10;
      } else {
        newPos[0] = pos[0] + 10 - 1;
        newPos[1] = pos[1];
        newPos[2] = pos[2] - 10 + 1;
        newPos[3] = pos[3] + 2;
      }
      newPos = this.preventRotationOverlap(newPos);
      return newPos;
    },

    preventRotationOverlap: function(pos) {
      let left = 0;
      let right = 0;
      for (let i = 0; i < 4; i++) {
        if (pos[i] % 10 > 6 && pos[i] % 10 < 10) right++;
        else if (pos[i] % 10 >= 0 && pos[i] % 10 < 4) left++;
      }

      if (left > 0 && right > 0) {
        if (left > right) {
          for (let i = 0; i < 4; i++) pos[i]++;
        } else {
          for (let i = 0; i < 4; i++) pos[i]--;
        }

        pos = this.preventRotationOverlap(pos);
      }

      return pos;
    }
  },

  mounted() {
    window.addEventListener("keydown", e => {
      var key = e.which || e.keyCode;
      if (key === 37) {
        this.left();
      } else if (key == 39) {
        this.right();
      } else if (key == 40) {
        this.down();
      } else if (key == 16 || key == 65 || key == 38) {
        this.rotatel();
      } else if (key == 32 || key == 68) {
        this.rotater();
      }
    });
  }
};
</script>

<style>
</style>
