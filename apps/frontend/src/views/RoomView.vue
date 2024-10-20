<template>
    <div class="room-layout" :class="{ 'has-perspective':  hasPerspective }">
        <div class="room-container">
            <div class="room-seats">
                <div class="scroll-area">
                    <div class="seats-grid">
                        <div class="seat" v-for="n in 54">{{n}}</div>
                    </div>
                </div>
            </div>
            <div class="room-stage">
                <div class="stage-screen">
                    <div class="fuzzy-overlay"></div>
                    <div class="vignette"></div>
                </div>
            </div>
        </div>
        <div class="room-bottom-bar">
            <IconButton />
            <IconEmojiStars icon-color="white" />
            <IconMicrophone icon-color="white" />
            <IconMicrophoneSlash icon-color="white" />
            <IconEllipsisVertical icon-color="white" />
            <IconVideo icon-color="white"/>
            <IconVideoSlash icon-color="white"/>
            <IconUsers icon-color="white"/>
            <IconFilm icon-color="white"/>
            <IconFilmSlash icon-color="white"/>
            <IconComments icon-color="white"/>
            <IconDoorOpen icon-color="white"/>
            <IconVolumeHigh icon-color="white"/>
            <IconExpand icon-color="white"/>
            <IconCompress icon-color="white"/>
            <button @click="toggleScreen">toggle screen perspective</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconButton from '../components/IconButton.vue';
import IconMicrophone from '../components/icons/IconMicrophone.vue';
import IconMicrophoneSlash from '../components/icons/IconMicrophoneSlash.vue';
import IconEmojiStars from '../components/icons/IconEmojiStars.vue';
import IconEllipsisVertical from '../components/icons/IconEllipsisVertical.vue';
import IconVideoSlash from '../components/icons/IconVideoSlash.vue';
import IconVideo from '../components/icons/IconVideo.vue';
import IconUsers from '../components/icons/IconUsers.vue';
import IconFilm from '../components/icons/IconFilm.vue';
import IconComments from '../components/icons/IconComments.vue';
import IconDoorOpen from '../components/icons/IconDoorOpen.vue';
import IconVolumeHigh from '../components/icons/IconVolumeHigh.vue';
import IconExpand from '../components/icons/IconExpand.vue';
import IconCompress from '../components/icons/IconCompress.vue';
import IconFilmSlash from '../components/icons/IconFilmSlash.vue';


const hasPerspective = ref(true)

function toggleScreen() {
    hasPerspective.value = !hasPerspective.value
}
</script>

<style scoped>
.room-layout {
    background-color: blueviolet;
    display: grid;
    grid-template-rows: 1fr 62px;
    height: 100vh;
}

.room-container {
    background-color: aqua;
    display: grid;
    grid-template-columns: 1fr 2fr;
    overflow: hidden;
}

.room-bottom-bar {
    background-color: rgba(0, 0, 0, 0.5);
    height: 62px;
}

.room-stage {
    background-color: #303030;
    display: grid;
    place-items: center;
}

.room-seats {
    background-color: teal;
    position: relative;
    overflow: hidden;
}

.seats-grid {
    background-color: slategray;
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    padding: 60px 15px;
    max-width: 385px;
    margin: auto;
    /* height: 100%; */
}

.seat {
    background-color: slateblue;
    width: 36px;
    height: 36px;

    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.scroll-area {
    background-color: steelblue;
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
</style>
