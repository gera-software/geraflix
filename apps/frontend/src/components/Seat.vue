<template>
    <div class="seat">
        <div class="seat--empty">{{id}}</div>
    </div>
</template>
<script setup lang="ts">
interface Props {
    id: string
}

defineProps<Props>()

</script>
<style scoped>
.seat {
    width: 36px;
    height: 36px;
}

.seat--empty {
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