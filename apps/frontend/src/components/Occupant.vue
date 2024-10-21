<template>
    <div class="occupant">
        <Avatar :user="occupant.user" />
        <div class="connection-status" :class="{ 'connection-status--online': occupant.connectionStatus}" :title="occupant.connectionStatus ? 'online' : 'offline'"></div>
    </div>
</template>
<script setup lang="ts">
import Avatar from './Avatar.vue';
import type { IOccupant } from '../types';


interface Props {
    occupant: IOccupant
}

const { occupant } = defineProps<Props>()


</script>
<style scoped>
.occupant {
    position: relative;
}

.connection-status {
    position: absolute;
    width: 12px;
    height: 12px;
    bottom: -2px;
    right: -4px;
    background: #2DAA4E;
    border: 2px solid #000000;
    border-radius: 100%;
    background: #FF4242;

}

.connection-status.connection-status--online {
    background: #2DAA4E;
}

</style>