<template>
    <div class="seat">
        <div class="seat--empty">{{seat.id}}</div>
        <Occupant v-if="seat.occupant" :occupant="seat.occupant"/>
    </div>
</template>
<script setup lang="ts">
import type { ISeat } from '../types';
import Occupant from './Occupant.vue';

interface Props {
    seat: ISeat
}

defineProps<Props>()

</script>
<style scoped>
.seat {
    position: relative;
    width: 36px;
    height: 36px;
}

.seat--empty {
    position: absolute;
    width: 36px;
    height: 36px;
    opacity: 0.5;
    border: 1px dashed #FFFFFF;
    border-radius: 28px;

    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #FFFFFF;
}
</style>