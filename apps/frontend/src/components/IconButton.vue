<template>
    <button class="icon-button">
        <IconEmojiStars icon-color="white" />
    </button>
</template>
<script lang="ts" setup>
import IconEmojiStars from './icons/IconEmojiStars.vue';
</script>
<style scoped>
.icon-button {
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    display: inline-flex;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 100%;
    text-align: center;
    cursor: pointer
}
</style>