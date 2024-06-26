<template>
    <div>
        <button @click="startGame">开始游戏</button>
        <button>难度</button>
        <div @click="changeTimeFormat">{{ timeFormat() }}</div>
        <div v-for="y in 10" :key="y" class="row">
            <button v-for="x in 10" :key="x" class="block" @click="handlerClick(x, y)">{{ blockDisplay(state?.[y -
                1]?.[x - 1])
                }}</button>
        </div>
        <div>Count: {{ count }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BlockState } from './model/block-state';
const state = ref<BlockState[][]>([]);
const timer = ref(0);
const direction = [
    [1, 1], [1, -1], [1, 0], [0, 1], [0, -1], [-1, 0], [-1, 1], [-1, -1]
];
let timerId: number;

let timeState: 'expand' | 'sort' = 'sort';

let count: number = 0;
function startGame() {
    state.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }, (): BlockState => {
        return {
            adjacentMines: 0,
            isFlaged: false,
            mines: Math.random() <= 0.25,
            isRevealed: false,
        }
    }));
    state.value.forEach((item, y) => {
        item.forEach((block, x) => {
            for (const [dx, dy] of direction) {
                block.adjacentMines += state.value?.[y + dy]?.[x + dx]?.mines ? 1 : 0;
            }
        })
    })
    count = state.value.flat().filter(block => block.mines).length;
    clearInterval(timerId);
    timer.value = 0;
    timerId = setInterval(() => {
        timer.value++;
    }, 1000)
}

function blockDisplay(block: BlockState) {
    return block?.isRevealed ? (block.mines ? '*' : block.adjacentMines) : '-';
}

function handlerClick(x: number, y: number) {
    const block = state.value?.[y - 1]?.[x - 1];
    if (!block || block.isRevealed) return;
    block.isRevealed = true;
    if (!block.adjacentMines) {
        for (const [dx, dy] of direction) {
            handlerClick(x + dx, y + dy);
        }
    }
}

function changeTimeFormat() {
    timeState = timeState === 'expand' ? 'sort' : 'expand';
}

function timeFormat() {
    return timeState === 'sort' ? `${Math.floor(timer.value / 3600)}:${Math.floor(timer.value / 60)}:${timer.value % 60}` : timer.value;
}
</script>

<style>
.block {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid;
    border-color: #fff gray gray #fff;
    cursor: pointer;

    &:hover {
        background-color: gray;
    }
}
</style>