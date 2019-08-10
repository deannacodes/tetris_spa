import Vuex from 'vuex'
import Vue from 'vue'
import Axios from 'axios';
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        blocks: setInitialBlocks(),
        interval: null,
        activePos: null,
        currentBlock: 0,
        currentBlockType: null,
        fallingSpeed: 1000,
        level: 1,
        popCount: 0,
        score: 0,
        status: "Start",
        upNext: null,
        scores: [],
        sound: false
    },
    mutations: {
        newGame(state) {
            clearInterval(state.interval)
            state.blocks = []
            state.interval = null
            state.activePos = null
            state.currentBlock = 1
            state.currentBlockType = null
            state.fallingSpeed = 1000
            state.level = 1
            state.popCount = 0
            state.score = 0
            state.status = "Start"
            state.upNext = null
            state.blocks = setInitialBlocks()
        },
        setBlocksValuesOnActivePos(state) {
            for (let i = 0; i < 4; i++) {
                const thisBlock = state.blocks[state.activePos[i]]
                thisBlock.value = getTypeVal(state.currentBlockType)
                thisBlock.block = state.currentBlock;
            }
        },
        setBlocks(state, blocks) {
            state.blocks = blocks
        },
        setStateInterval(state, interval) {
            state.interval = interval
        },
        clearStateInterval(state) {
            clearInterval(state.interval)
            state.interval = null
        },
        setActivePos(state, pos) {
            state.activePos = pos
        },
        incrementCurrentBlock(state) {
            state.currentBlock++
        },
        setCurrentBlockType(state, type) {
            state.currentBlockType = type
        },
        setStatus(state, status) {
            state.status = status
        },
        incrementPopCount(state) {
            state.popCount++
        },
        setScore(state, multiplier) {
            let add = 0
            switch (multiplier) {
                case 1:
                    add = 40
                    break
                case 2:
                    add = 100
                    break
                case 3:
                    add = 300
                    break
                case 4:
                    add = 1200
                    break
                default:
                    add = 0

            }
            state.score += (add * state.level)
        },
        levelUp(state) {
            const oldLevel = state.level
            state.level = 1 + Math.floor(state.popCount / 10)
            if ((oldLevel < state.level) && (state.fallingSpeed >= 150)) state.fallingSpeed -= 150
        },
        setUpNext(state, next) {
            state.upNext = next
        },
        addScore(state, score) {
            state.scores.push(score)
        },
        setScores(state, scores) {
            state.scores = scores
        },
        toggleSound(state) {
            state.sound = !state.sound
        }
    },
    actions: {
        getScores({ commit }) {
            Axios.get("api/scores")
                .then((response) => {
                    const scoresResponse = response.data.response
                    let scores = []
                    for (let i = 0; i < scoresResponse.length; i++) {
                        const score = {
                            id: scoresResponse[i].id,
                            name: scoresResponse[i].name,
                            score: scoresResponse[i].score
                        }
                        scores.push(score)
                    }
                    commit('setScores', scores)
                })
        },
        addScore({ commit }, score) {
            const url = "api/scores?name=" + score.name + "&score=" + score.score 
            Axios.post(url).then((response) => {
                this.dispatch('getScores')
            })
        }
    }
})


function getTypeVal(type) {
    const currentBlockType = type;
    if (currentBlockType === "line") return 1;
    else if (currentBlockType === "t") return 2;
    else if (currentBlockType === "s") return 3;
    else if (currentBlockType === "z") return 4;
    else if (currentBlockType === "l") return 5;
    else if (currentBlockType === "j") return 6;
    else return 7;
}


function setInitialBlocks() {
    const b = []
    for (let i = 0; i < 200; i++) {
        b.push({ id: i, block: 0, value: 0 })
    }
    return b
}
