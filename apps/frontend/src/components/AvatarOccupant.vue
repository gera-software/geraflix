<template>
    <div class="occupant">
        <BaseAvatar :name="occupant.user.name" :color="occupant.user.color" />

        <BaseBadge style="position: absolute; bottom: -2px; right: -4px;" is-dot :background-color="occupant.connectionStatus ? '#2DAA4E' : '#FF4242'" :title="occupant.connectionStatus ? 'online' : 'offline'"/>
        <BaseBadge style="position: absolute; bottom: -8px; right: -8px;" v-if="occupant.connectionStatus && !occupant.micStatus"  background-color="#303030" title="mic off">
            <IconMicrophoneSlash :width="15" :height="12" icon-color="#FF4242"/>
        </BaseBadge>
    </div>
</template>
<script setup lang="ts">
import BaseAvatar from './BaseAvatar.vue';
import type { IOccupant } from '../types';
import IconMicrophoneSlash from './icons/IconMicrophoneSlash.vue';
import BaseBadge from './BaseBadge.vue';


interface Props {
    occupant: IOccupant
}

const { occupant } = defineProps<Props>()


</script>
<style scoped>
.occupant {
    position: relative;
}

</style>