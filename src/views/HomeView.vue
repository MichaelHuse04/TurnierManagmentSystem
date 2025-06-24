<script setup lang="ts">
import type { Player } from '@/stores/typs.ts'
import { computed, ref, type Ref } from 'vue'
import ListOfMatchUps from "@/components/ListOfMatchUps.vue";
import FinishedView from "@/components/FinishedView.vue";

const players: Ref<Player[]> = ref([])
const matchUps: Ref<object> = ref({})
const round: Ref<number> = ref(1)
const matchupSize: Ref<number> = ref(2)
let gameHasStarted = false
let gameHasFinished = false

const addToPlayers = () => {
  const input: HTMLInputElement | null = document.querySelector('#user')
  if (input?.value) {
    players.value.push({
      name: input!!.value,
      hasWonGame: null,
      matchesWon: 0,
      randomValue: 0,
    })
    console.log('ok');
  } else {
    console.log('not ok');
  }
  console.log(players.value);
}

const removePlayer = (index: number) => {
  players.value.splice(index, 1)
}

const startNextRound = (match: [Player[]]) => {
  round.value++;

  if (amountOfMatches.value + 1 < round.value){
    gameHasFinished = true;
    return
  }

  const allPlayers = JSON.parse(JSON.stringify(match.flat(2)));
  allPlayers.sort((player1: Player, player2: Player) => player2.matchesWon - player1.matchesWon);
  console.log(allPlayers);


    allPlayers.forEach((player: Player, index: number) => {
      player.hasWonGame = null;
      if ((index + 1) % matchupSize.value === 0) {
        const match = [];
        for (let i = 0; i < matchupSize.value; i++) {
          match.push(allPlayers[index - i]);
        }
        if (match.length > 0) {
          matchUps.value[`${round.value}`].push(match);
          console.log(matchUps.value[`${round.value}`]);
        }
      }
    })
    if (matchUps.value[`${round.value}`].length !== allPlayers.length / 2) {
      const playersThatHaveFoundAMatchUp = matchUps.value[`${round.value}`].length * matchupSize.value
      allPlayers.forEach((player: Player, index: number) => { // spieler anzahl pro match ist noch nicht richtig
        const match = [];
        if (index + 1 > playersThatHaveFoundAMatchUp) {
          match.push(allPlayers[index]);
          console.log(player);
        }
        if (allPlayers.length === index + 1) {
          matchUps.value[`${round.value}`].push(match);
        }
      });
    }

    console.log(round.value)
    console.log(amountOfMatches.value)
}

const amountOfMatches = computed(() => {
// einfach nicht nachfragen, was ich hier am Kochen war
  let r = 0
  let x = players.value.length
  do {
    x = x / matchupSize.value
    if (x <= 1 ) {
      break
    }
    r++;
  } while (true)
  return r
})

const startsGame = () => {
  gameHasStarted = true

  for (let i = 1; i - 1 <= amountOfMatches.value; i++) {
    // ist schon ok hier
    matchUps.value[`${i}`] = []
  }

  players.value.forEach((player) => (player.randomValue = Math.random()))
  players.value = players.value.sort(
    (player1, player2) => player1.randomValue - player2.randomValue
  )
  players.value.forEach((player, index) => {
    if ((index + 1) % matchupSize.value === 0) {
      const match = []
      for (let i = 0; i < matchupSize.value; i++) {
        match.push(players.value[index - i])
      }
      if (match.length > 0) {
        matchUps.value[1].push(match)
        console.log(matchUps.value[1])
      }
    }
  })
  if (matchUps.value[1].length !== players.value.length / 2) {
    const playersThatHaveFoundAMatchUp = matchUps.value[1].length * matchupSize.value
    players.value.forEach((player, index) => { // spieler anzahl pro match ist noch nicht richtig
      const match = []
      if (index + 1 > playersThatHaveFoundAMatchUp) {
        match.push(players.value[index])
        console.log(player)
      }
      if (players.value.length === index + 1) {
        matchUps.value[1].push(match)
      }
    })
  }
  console.log(matchUps.value)
}
</script>

<template>
  <body>
    <section class="inputs">
      <label for="user">Spieler name: </label>
      <input
        type="text"
        name="user"
        id="user"
        @keydown.enter="!gameHasStarted ? addToPlayers() : null"
      />
      <!--      <label for="number-of-players-per-game">anzahl Spieler pro spiel: </label>-->
      <!--      <input type="number" id="number-of-players-per-game" name="number-of-players-per-game">-->
      <button @click="addToPlayers" :disabled="gameHasStarted">add player</button>
      <button v-if="!gameHasStarted" @click="startsGame">Start Game</button>
      <button v-if="gameHasStarted" disabled>Start next round</button>
      <a href=""><button>Reset</button></a>
    </section>
    <aside>
      <h3>Players</h3>
      <ul>
        <li
          v-for="(player, index) in players"
          @click="!gameHasStarted ? removePlayer(index) : null"
        >
          {{ player.name }} Wins: {{ player.matchesWon }}
        </li>
      </ul>
    </aside>

  <div v-if="gameHasStarted">
    <div v-for="match in matchUps">
      <list-of-match-ups  :match-ups="match" v-if="match[0]" @submit-match="startNextRound" :current-round="round">

      </list-of-match-ups>
    </div>
  </div>
  <div v-if="gameHasFinished">
    <finished-view></finished-view>
  </div>
  </body>
</template>
<style>
body {
  background-color: darkgrey;
  height: 100%;
}

.inputs {
  text-align: center;
}
</style>
