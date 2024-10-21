<template>
    <div class="room-layout" :class="{ 'has-perspective':  hasPerspective }">
        <div class="room-container">
            <div class="room-seats">
                <div class="scroll-area">
                    <div class="seats-grid">
                        <Seat v-for="seat of seats" :key="seat.id" :seat="seat"></Seat>
                    </div>
                </div>
            </div>
            <div class="room-stage">
                <div class="stage-screen">
                    <div class="fuzzy-overlay"></div>
                    <div class="vignette"></div>
                </div>
                <div class="buttons-bar">
                    <ButtonIcon title="Volume" variant="secondary">
                        <IconVolumeHigh/>
                    </ButtonIcon>
                    <ButtonIcon title="Fullscreen" variant="secondary">
                        <IconExpand/>
                    </ButtonIcon>
                </div>
            </div>
        </div>
        <div class="room-bottom-bar">
            <Occupant v-if="seats[0].occupant" :occupant="seats[0].occupant"/>
            <ButtonIcon title="status-off" variant="status-off">
                <IconMicrophoneSlash/>
            </ButtonIcon>
            <ButtonIcon title="default" :disabled="true">
                <IconVideoSlash/>
            </ButtonIcon>
            <ButtonIcon title="status-on" variant="status-on">
                <IconFilm />
            </ButtonIcon>
            <ButtonIcon title="danger" variant="danger">
                <IconDoorOpen />
            </ButtonIcon>
            <button @click="toggleScreen">toggle screen perspective</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonIcon from '../components/ButtonIcon.vue';
import IconMicrophoneSlash from '../components/icons/IconMicrophoneSlash.vue';
import IconVideoSlash from '../components/icons/IconVideoSlash.vue';
import IconFilm from '../components/icons/IconFilm.vue';
import IconDoorOpen from '../components/icons/IconDoorOpen.vue';
import IconVolumeHigh from '../components/icons/IconVolumeHigh.vue';
import IconExpand from '../components/icons/IconExpand.vue';
import Seat from '../components/Seat.vue';
import type { IAttendee, IHost, ISeat } from '../types';
import Occupant from '../components/Occupant.vue';

const hasPerspective = ref(true)

function toggleScreen() {
    hasPerspective.value = !hasPerspective.value
}

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
    user: {
        id: 'aad',
        name: 'Gilmar Andrade',
        color: '#B03AFF'
    },
    connectionStatus: true,
    micStatus: true,
    camStatus: false,
    screenShareStatus: true
} as IHost

seats.value[8].occupant = {
    kind: 'attendee',
    user: {
        id: 'wsdf',
        name: 'Arnaldo Antunes',
        color: '#42D1EB'
    },
    connectionStatus: false,
    micStatus: false,
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

    transform: rotateY(0);
    transition: transform .5s ease-in;
}

.stage-screen .fuzzy-overlay {
    position: absolute;
    inset: -200%;
    opacity: 25%;
    background-image: url('../assets/noise.png');
    animation: shift .2s linear infinite both;
    pointer-events: none;
}

@keyframes shift {
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

.has-perspective .stage-screen {
    transform: rotateY(-2deg); 
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
