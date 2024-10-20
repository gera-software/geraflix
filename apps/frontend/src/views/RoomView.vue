<template>
    <div class="room-layout">
        <div class="room-container">
            <div class="room-seats">
                <h1>Room seats</h1>
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
}
</style>
