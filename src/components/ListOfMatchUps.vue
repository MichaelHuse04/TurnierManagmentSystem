<script setup lang="ts">

import type { Player } from '@/stores/typs.ts'
import {computed} from "vue";

const props = defineProps({
  matchUps: Array,
})

const matchUps : [Player[]] = computed(() => {
  return props.matchUps
})

const playerWon = (wonPlayer: Player, lostPlayer: Player) => {
  wonPlayer.hasWonGame = true;
  if (lostPlayer) {
    lostPlayer.hasWonGame = false;
  }
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
      Match 1
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
          <td @click="playerWon(player[0], player[1])" :class="getStyleOfWinOrLose(player[0])">{{player[0].name}}</td>
          <td>{{player[0].matchesWon}}</td>
          <td>VS.</td>
          <td @click="player[1] ? playerWon(player[1], player[0]): null" :class="getStyleOfWinOrLose(player[1])">{{player[1]?.name}}</td>
          <td>{{player[1]?.matchesWon}}</td>
      </tr>
    </tbody>
  </table>

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