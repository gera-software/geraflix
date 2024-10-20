<template>
    <div class="room-layout">
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

            bottom bar
        </div>
    </div>
</template>

<script setup lang="ts">

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
    background-color: yellow;
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
</style>
