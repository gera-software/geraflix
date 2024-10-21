<template>
    <div class="occupant">
        <BaseAvatar :name="occupant.user.name" :color="occupant.user.color" />
        <div class="connection-status" :class="{ 'connection-status--online': occupant.connectionStatus}" :title="occupant.connectionStatus ? 'online' : 'offline'"></div>
        <div v-if="occupant.connectionStatus && !occupant.micStatus" class="mic-status" title="mic off">
            <IconMicrophoneSlash :width="15" :height="12" icon-color="#FF4242"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import BaseAvatar from './BaseAvatar.vue';
import type { IOccupant } from '../types';
import IconMicrophoneSlash from './icons/IconMicrophoneSlash.vue';


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
    border: 2px solid #303030;
    border-radius: 100%;
    background: #FF4242;
}

.connection-status.connection-status--online {
    background: #2DAA4E;
}

.mic-status {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -8px;
    right: -8px;

    display: grid;
    place-items: center;

    border: 2px solid #303030;
    border-radius: 100%;
    background: #303030;
}

</style>