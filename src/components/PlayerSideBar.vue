<script setup lang="ts">
// TODO: doesn't look that nice yet
import type {Player} from "@/stores/typs.ts";
import {computed, ref, type Ref} from "vue";

const props = defineProps<{
  players: Player[],
  gameHasStarted: boolean,
  playersTabIsOpen: boolean,
}>();

const players: Ref<Player[]> = ref(props.players)
const playerName: Ref<string> = ref("");

const gameHasStarted = computed(() => {
  return props.gameHasStarted;
});

const emits = defineEmits<{
  (e: "remove",playerIndex: number): void,
  (e: "add", playerName: string): void,
  (e: "openTab"): void,
  (e: "closeTab"): void,
}>();

function emitPlayerWasAdded() {
  emits("add", playerName.value);
  playerName.value = "";
}

</script>

<template>
  <div v-if="props.playersTabIsOpen">
    <button class="button" @click="emits('closeTab')">X</button>
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
  </div>
  <div v-else>
    <button class="button" @click="emits('openTab')">>></button>
  </div>
</template>

<style scoped>

li {
  margin: 1px;
  background-color: darkgrey;
}
.button{
  background-color: transparent;
  border: slategrey 3px solid;
  padding: 1rem;
  font-size: large;
  border-radius: 1rem;
  float: right;
}
</style>