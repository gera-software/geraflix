<template>
    <div class="avatar" :title="name" :style="style">
        {{ sigla }}
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
    name: string,
    color: string
}

const { name, color } = defineProps<Props>()

const sigla = computed(() => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2)
})

const style = computed(() => {
    return {
        backgroundColor: color
    }
})

</script>
<style scoped>
.avatar {
    width: 36px;
    height: 36px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #6a6170;
    border-radius: 28px;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    color: #FFFFFF;
}
</style>