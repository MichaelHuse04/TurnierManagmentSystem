<script setup lang="ts">
// TODO: To the players SideBar
// TODO: BUG: Game will start after deleting a player or increasing the amount of players per match!
import type {Player} from "@/stores/typs.ts";
import {computed, ref, type Ref} from "vue";

const props = defineProps<{
  players: Player[],
  gameHasStarted: boolean,
}>();

const players: Ref<Player[]> = ref(props.players)
const playerName: Ref<string> = ref("");


const gameHasStarted = computed(() => {
  return props.gameHasStarted;
});

const emits = defineEmits<{
  (e: "remove",playerIndex: number): void,
  (e: "add", playerName: string): void,
}>();

function emitPlayerWasAdded() {
  emits("add", playerName.value);
  playerName.value = "";
}

</script>

<template>
  <div v-if="!gameHasStarted">
    <label for="user">Spieler name: </label>
    <input
        type="text"
        name="user"
        id="user"
        v-model.trim="playerName"
        @keyup.enter="!gameHasStarted ? emitPlayerWasAdded() : null"
        :disabled="gameHasStarted"
    />
    <button @click="emitPlayerWasAdded" :disabled="gameHasStarted">add player</button>
  </div>
  <h3>Players</h3>
  <ul>
    <li
        v-for="(player, index) in players"
        @click="!gameHasStarted ? emits('remove', index) : null"
        v-bind:key="index"
    >
      {{ player.name }}
    </li>
  </ul>
</template>

<style scoped>

li {
  margin: 1px;
  background-color: darkgrey;
}
</style>