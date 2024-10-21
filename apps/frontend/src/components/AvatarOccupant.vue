<template>
    <div class="occupant">
        <BaseAvatar :name="occupant.name" :color="occupant.color" />

        <slot name="badges">
            <BadgeConnectionStatus :connection-status="occupant.connectionStatus" />
            <BadgeMicStatus v-if="occupant.connectionStatus && !occupant.micStatus" :mic-status="occupant.micStatus" />
        </slot>

    </div>
</template>
<script setup lang="ts">
import BaseAvatar from './BaseAvatar.vue';
import type { IOccupant } from '../types';
import BadgeConnectionStatus from './BadgeConnectionStatus.vue';
import BadgeMicStatus from './BadgeMicStatus.vue';

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