<script setup lang="ts">

import type { Player } from '@/stores/typs.ts'
import {computed, ref, type Ref} from "vue";
const roundHasFinished: Ref<boolean> = ref(false);

const props = defineProps({
  matchUps: Array,
  currentRound: Number,
})

const currentRound = computed(() => {
  return props.currentRound;
})

const matchUps : [Player[]] = computed(() => {
  return props.matchUps
});

const emits = defineEmits<{
  (e: "submitMatch", match: [Player[]]): void
}>();

const allGamsHaveFinished = (): boolean => {
  if (roundHasFinished.value) {
    return false
  }
  return matchUps.value.flat(2).every((player: Player) => player.hasWonGame !== null);
}

const playerWon = (wonPlayer: Player, lostPlayer: Player) => {
  wonPlayer.hasWonGame = true;
  if (lostPlayer) {
    lostPlayer.hasWonGame = false;
  }
}

const confirmWin = () => {
  matchUps.value.forEach((players: Player[]) => {
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
      Match {{ currentRound }}
    </caption>
    <thead>
      <tr>
        <th>Name</th>
        <th>Wins</th>
        <th></th>
        <th>Name</th>
        <th>Wins</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in matchUps" key="matchUp">
          <td @click="!roundHasFinished ? playerWon(player[0], player[1]): null" :class="getStyleOfWinOrLose(player[0])">{{player[0].name}}</td>
          <td>{{player[0].matchesWon}}</td>
          <td>VS.</td>
          <td @click="!roundHasFinished ? player[1] ? playerWon(player[1], player[0]): null: null" :class="getStyleOfWinOrLose(player[1])">{{player[1]?.name}}</td>
          <td>{{player[1]?.matchesWon}}</td>
      </tr>
    </tbody>
  </table>
  <button @click="() => {
    confirmWin();
    emits('submitMatch', matchUps);
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