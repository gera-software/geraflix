<template>
    <div class="badge" :class="{ 'badge--is-dot': isDot }" :style="{backgroundColor: backgroundColor}">
        <slot>
            <span class="badge_text">
                {{ text }}
            </span>
        </slot>
    </div>
</template>
<script setup lang="ts">

interface Props {
    text?: string,
    backgroundColor: string
    isDot?: boolean
}

const { isDot = false } = defineProps<Props>()

</script>
<style scoped>
.badge {
    background-color: purple;
    border-radius: 20px;
    min-width: 20px;
    height: 20px;
    border: 2px solid #303030;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.badge_text {
    padding-inline: 5px;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 12px;
    color: #FFFFFF;
}

.badge--is-dot {
    min-width: 12px;
    width: 12px;
    height: 12px;
    padding: 0;
}
</style>