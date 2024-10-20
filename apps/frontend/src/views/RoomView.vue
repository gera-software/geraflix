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
                <h1>Room stage</h1>
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
    background-color: violet;
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
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
