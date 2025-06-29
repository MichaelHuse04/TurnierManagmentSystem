<script setup lang="ts">

import type { Player } from '@/stores/typs.ts'
import {computed, ref, type Ref} from "vue";
const roundHasFinished: Ref<boolean> = ref(false);

const props = defineProps<{
  matchUps: Player[][],
  currentRound: number,
}>();



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
</script>

<template>
  <table>
    <caption>
      Match {{ props.currentRound }}
    </caption>
    <thead>
    <tr>
      <template v-for="(player, index) in matchUp[0]" v-bind:key="index">
          <td>Name</td>
          <td>Wins</td>
          <td v-if="matchUp[0].length !== index + 1"></td>
      </template>
    </tr>
    </thead>
    <tbody>
      <tr v-for="(players, index) in matchUp" v-bind:key="index">
        <template v-for="(player, i) in players" v-bind:key="player">
            <td @click="!roundHasFinished ? playerWon(player, players): null" :class="getStyleOfWinOrLose(player)">{{player.name}}</td>
            <td>{{player.matchesWon}}</td>
            <td v-if="players.length !== i + 1">VS.</td>
        </template>
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