<template>
  <div>
    <h3>High Scores</h3>
    <ol class="high-scores">
      <li class="score" v-for="score in scores" v-bind:key="score.id">
        <span class="score-name">{{ score.name }}</span> -
        <span class="score-score">{{ score.score }}</span>
      </li>
    </ol>

    <b-modal id="gameOver" title="Game Over" @ok="addScore">
      <form>
        <div class="form-group">
          <label for="name">Enter your name to save your score.</label>
          <input
            type="text"
            class="form-control"
            id="modalName"
            aria-describedby="name"
            placeholder="Enter name"
            v-model="name"
            maxlength="99"
          />
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "high-scores",
  data() {
    return {
      name: ""
    };
  },
  computed: mapState({
    status: "status",
    score: "score",
    scores: "scores",

    topScores() {
      const topScores = [];
      this.scores.sort((a, b) => (a.score < b.score ? 1 : -1));
      const size = Math.min(this.scores.length, 10);

      for (let i = 0; i < size; i++) {
        topScores.push(this.scores[i]);
      }

      return topScores;
    }
  }),
  watch: {
    status(newStatus, oldStatus) {
      if (newStatus == "Game Over") {
        this.$bvModal.show("gameOver");
      }
    }
  },
  methods: {
    addScore: function() {
      const score = {
        name: this.name,
        score: this.score
      };
      this.$store.dispatch("addScore", score);
    }
  }
};
</script>

<style>
</style>