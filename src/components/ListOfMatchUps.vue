<script setup lang="ts">

import type { Player } from '@/stores/typs.ts'
import {computed, ref, type Ref} from "vue";
const roundHasFinished: Ref<boolean> = ref(false);

const props = defineProps<{
  matchUps: Player[][],
  currentRound: number,
}>();


const setUp = () => {
  currentRoundForThisMatch = props.currentRound;
}
let currentRoundForThisMatch: number;


const matchUp = computed(() => {
  return props.matchUps
});

const emits = defineEmits<{
  (e: "submitMatch", match: Player[][]): void
}>();

const allGamsHaveFinished = (): boolean => {
  if (roundHasFinished.value) {
    return false
  }
  console.log(matchUp.value.flat(2))
  return matchUp.value.flat(2).every((player: Player) => player.hasWonGame !== null);
}

const playerWon = (wonPlayer: Player, allPlayers: Player[]) => {
  allPlayers.forEach((player: Player) => {
    player.hasWonGame = false;
  })

  wonPlayer.hasWonGame = true;

}

const confirmWin = () => {
  matchUp.value.forEach((players: Player[]) => {

      players.forEach((player: Player) => {
        if(player.hasWonGame){
          player.matchesWon++;
        }
      });
  });
}

const getStyleOfWinOrLose = (player: Player) => {
  if (player?.hasWonGame === true){
    return "has-won";
  } else if (player?.hasWonGame === false) {
    return "has-lost";
  } else {
    return "unknown";
  }
}
setUp()
</script>

<template>
  <table>
    <caption>
      Match {{ currentRoundForThisMatch }}
    </caption>
    <thead>
    <tr>

      <th v-if="matchUp[0][0]">Name</th>
      <th v-if="matchUp[0][0]">Wins</th>
      <th v-if="matchUp[0][1]"></th>
      <th v-if="matchUp[0][1]">Name</th>
      <th v-if="matchUp[0][1]">Wins</th>
      <th v-if="matchUp[0][2]"></th>
      <th v-if="matchUp[0][2]">Name</th>
      <th v-if="matchUp[0][2]">Wins</th>
      <th v-if="matchUp[0][3]"></th>
      <th v-if="matchUp[0][3]">Name</th>
      <th v-if="matchUp[0][3]">Wins</th>

    </tr>
    </thead>
    <tbody>
      <tr v-for="players in matchUp" key="matchUp">
          <td v-if="players[0]" @click="!roundHasFinished ? playerWon(players[0], players): null" :class="getStyleOfWinOrLose(players[0])">{{players[0].name}}</td>
          <td v-if="players[0]">{{players[0].matchesWon}}</td>
          <td v-if="players[1]">VS.</td>
          <td v-if="players[1]" @click="!roundHasFinished ? players[1] ? playerWon(players[1], players): null: null" :class="getStyleOfWinOrLose(players[1])">{{players[1]?.name}}</td>
          <td v-if="players[1]">{{players[1]?.matchesWon}}</td>
          <td v-if="players[2]">VS.</td>
          <td v-if="players[2]" @click="!roundHasFinished ? players[2] ? playerWon(players[2], players): null: null" :class="getStyleOfWinOrLose(players[2])">{{players[2]?.name}}</td>
          <td v-if="players[2]">{{players[2]?.matchesWon}}</td>
          <td v-if="players[3]">VS.</td>
          <td v-if="players[3]" @click="!roundHasFinished ? players[3] ? playerWon(players[3], players): null: null" :class="getStyleOfWinOrLose(players[3])">{{players[3]?.name}}</td>
          <td v-if="players[3]">{{players[3]?.matchesWon}}</td>
      </tr>
    </tbody>
  </table>
  <button @click="() => {
    confirmWin();
    emits('submitMatch', matchUp);
    roundHasFinished = true
  }" :disabled="!allGamsHaveFinished()" v-if="!roundHasFinished">Next Round</button>
</template>

<style scoped>
table{
  border: antiquewhite 2px solid;
}
th, td{
  border: antiquewhite 2px solid;

}

.has-won{
  background-color: aquamarine;
}
.has-lost{
  background-color: crimson;
}
</style>