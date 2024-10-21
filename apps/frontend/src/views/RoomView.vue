<template>
    <div class="room-layout" :class="{ 'is-stage-fullscreen':  isStageFullscreen }">
        <div class="room-container">
            <div class="room-seats">
                <div class="scroll-area">
                    <div class="seats-grid">
                        <Seat v-for="seat of seats" :key="seat.id" :seat="seat"></Seat>
                    </div>
                </div>
            </div>
            <div ref="elStage" class="room-stage">
                <div class="stage-screen">
                    <div class="fuzzy-overlay"></div>
                    <div class="vignette"></div>
                </div>
                <div class="buttons-bar">
                    {{ sliderValue }}
                    <BaseButtonSlider title="Volume" variant="secondary" v-model="sliderValue">
                        <template #icon>
                            <IconVolumeXMark v-if="sliderValue == 0"/>
                            <IconVolumeHigh v-else />
                        </template>
                    </BaseButtonSlider>
                    <BaseButtonSlider title="Volume" variant="secondary" v-model="sliderValue">
                        <template #icon>
                            <IconVolumeXMark v-if="sliderValue == 0"/>
                            <IconVolumeHigh v-else />
                        </template>
                    </BaseButtonSlider>
                    <BaseButtonIcon :title="isStageFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'" variant="secondary" @click="toggleFullScreen">
                        <IconCompress v-if="isStageFullscreen" />
                        <IconExpand v-else />
                    </BaseButtonIcon>
                </div>
            </div>
        </div>
        <div class="room-bottom-bar">
            {{sliderValue}}

            
            <AvatarOccupant v-if="seats[0].occupant" :occupant="seats[0].occupant">
                <template v-slot:badges>
                    <BadgeConnectionStatus :connection-status="seats[0].occupant.connectionStatus" />
                </template>
            </AvatarOccupant>
            <BaseButtonIcon title="status-off" variant="status-off">
                <IconMicrophoneSlash/>
            </BaseButtonIcon>
            <BaseButtonIcon title="default" :disabled="true">
                <IconVideoSlash/>
            </BaseButtonIcon>
            <BaseButtonIcon title="status-on" variant="status-on">
                <IconFilm />
            </BaseButtonIcon>
            <BaseButtonIcon title="danger" variant="danger">
                <IconDoorOpen />
            </BaseButtonIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseButtonIcon from '../components/BaseButtonIcon.vue';
import IconMicrophoneSlash from '../components/icons/IconMicrophoneSlash.vue';
import IconVideoSlash from '../components/icons/IconVideoSlash.vue';
import IconFilm from '../components/icons/IconFilm.vue';
import IconDoorOpen from '../components/icons/IconDoorOpen.vue';
import IconVolumeHigh from '../components/icons/IconVolumeHigh.vue';
import IconExpand from '../components/icons/IconExpand.vue';
import Seat from '../components/Seat.vue';
import type { IAttendee, IHost, ISeat } from '../types';
import AvatarOccupant from '../components/AvatarOccupant.vue';
import BadgeConnectionStatus from '../components/BadgeConnectionStatus.vue';
import IconCompress from '../components/icons/IconCompress.vue';

import { useFullscreen } from '@vueuse/core'
import Slider from '../components/Slider.vue';
import BaseButtonSlider from '../components/BaseButtonSlider.vue';
import IconVolumeXMark from '../components/icons/IconVolumeXMark.vue';

const sliderValue = ref(0.4)

function handleSlideChange(value: number) {
    console.log('slide changed', value)
}

const elStage = ref<HTMLElement | null>(null)

const { isFullscreen: isStageFullscreen, toggle: toggleFullScreen } = useFullscreen(elStage)

function generateSeatsId(rows: number, cols: number): string[] {
    return Array.from({ length: rows * cols }, (_, index) => {
        const row = String.fromCharCode(65 + Math.floor(index / cols)); // "A", "B", "C", etc.
        const col = (index % cols) + 1; // "1", "2", "3", etc.
        return `${row}${col}`;
    });
}

const seats = computed<ISeat[]>(() => {
    return generateSeatsId(9, 6).map(id => ({ id: id }))
})

seats.value[0].occupant = {
    kind: 'host',
    id: 'aad',
    name: 'Gilmar Andrade',
    color: '#B03AFF',
    connectionStatus: true,
    micStatus: false,
    camStatus: false,
    screenShareStatus: true
} as IHost

seats.value[8].occupant = {
    kind: 'attendee',
    id: 'wsdf',
    name: 'Arnaldo Antunes',
    color: '#42D1EB',
    connectionStatus: false,
    micStatus: true,
    camStatus: false,
} as IAttendee
</script>

<style scoped>
.room-layout {
    display: grid;
    grid-template-rows: 1fr 62px;
    height: 100vh;
    background-color: #303030;
}

.room-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    overflow: hidden;
}

.room-bottom-bar {
    background-color: rgba(0, 0, 0, 0.5);
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.room-stage {
    position: relative;
    display: grid;
    place-items: center;
}

.room-seats {
    position: relative;
    overflow: hidden;
}

.seats-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    padding: 60px 15px;
    max-width: 385px;
    margin: auto;
    /* height: 100%; */
}

.scroll-area {
    overflow-y: auto;
    height: 100%;
    max-height: 100%;
    
    display: grid;
    place-items: center
}

.stage-screen {
    background-color: rgb(0, 0, 0);
    width: 90%;
    height: 90%;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background-color: black;
    background-image: url('../assets/standby.png');
    background-size: contain;
    background-position: center;
    box-shadow: -11px 7px 21px -10px rgba(0,0,0,0.98);

    transform: rotateY(-2deg); 
    transition: 
        transform .3s ease-in .3s, 
        width .3s ease-in 0s, 
        height .3s ease-in 0s,
        border-radius .1s linear;
}

.stage-screen .fuzzy-overlay {
    position: absolute;
    inset: -200%;
    opacity: 25%;
    background-image: url('../assets/noise.png');
    animation: fuzzy-overlay .2s linear infinite both;
    pointer-events: none;
}

@keyframes fuzzy-overlay {
    0% {
        transform: translateX(0%) translateY(0%);
    }
    100% {
        transform: translateX(-10%) translateY(-10%);
    }
}

.stage-screen .vignette {
    position: absolute;
    inset: 0;
    box-shadow: 0 0 200px rgba(0,0,0,0.9) inset;
    pointer-events: none;
}


.room-stage {
    perspective: 90px;
    perspective-origin: center left;
}

.is-stage-fullscreen .stage-screen {
    border-radius: 0px;
    transform: rotateY(0);
    width: 100%;
    height: 100%;

    transition: 
        transform .3s ease-in 0s, 
        width .3s ease-in .3s, 
        height .3s ease-in .3s,
        border-radius 0s linear .6s;
}

.room-stage .buttons-bar {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    gap: 15px;
    padding: 15px;
}
</style>
