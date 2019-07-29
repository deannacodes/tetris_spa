import Vuex from 'vuex'
import Vue from 'vue'
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
        scores: []
    },
    mutations: {
        newGame(state) {
            clearInterval(state.interval)
            state.blocks = [],
                state.upNextBlocks = [],
                state.interval = null,
                state.activePos = null,
                state.currentBlock = 1,
                state.currentBlockType = null,
                state.fallingSpeed = 1000,
                state.level = 1,
                state.popCount = 0,
                state.score = 0,
                state.status = "Start",
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
            state.level = 1 + Math.floor(state.popCount / 10)
            if (state.fallingSpeed >= 150)
                state.fallingSpeed -= 150
        },
        setUpNext(state, next) {
            state.upNext = next
        },
        addScore(state, score) {
            state.scores.push(score)
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