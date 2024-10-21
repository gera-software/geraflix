<template>
    <button class="button-slider" :class="{ 'button-slider--secondary': variant == 'secondary', 'button-slider--danger': variant == 'danger', 'button-slider--status-on': variant == 'status-on', 'button-slider--status-off': variant == 'status-off'}" :disabled="disabled">
        <slot name="icon">
        </slot>
        <Slider style="width: 100px;" v-model="sliderValue" :min="min" :max="max" :disabled="disabled" />
    </button>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import Slider from './Slider.vue';

interface Props {
    variant?: 'secondary' | 'danger' | 'status-on' | 'status-off'
    min?: number
    max?: number
    disabled?: boolean
    modelValue: number
}

const emit = defineEmits(['update:modelValue'])

const { variant = null, disabled = false, min = 0, max = 1, modelValue } = defineProps<Props>()

const sliderValue = ref(modelValue)

watch(() => modelValue, () => {
    sliderValue.value = modelValue
})

watch(sliderValue, () => {
    emit('update:modelValue', sliderValue.value)
})
</script>
<style scoped>
.button-slider {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    
    /* width: 36px; */
    height: 36px;
    border: none;
    border-radius: 36px;
    text-align: center;
    cursor: pointer;

    background-color: #2F3136;
    color: white;
    z-index: 0;
}

.button-slider:not(:disabled):before {
    content: '';
    display: block;
    position: absolute;
    border-radius: 36px;
    inset: 0;
    z-index: -1;
    background-color: rgb(255, 255, 255);
    opacity: 0;
    transition: opacity .2s ease-in;
}

.button-slider:not(:disabled):hover:before {
    opacity: .15;
}

.button-slider:disabled {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.3) !important;
}


.button-slider.button-slider--secondary {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
}

.button-slider.button-slider--danger {
    background-color: #FF4242;
    color: white;
}

.button-slider.button-slider--status-on {
    background-color: rgba(45, 170, 78, 0.4);
    color: #2DAA4E;
}

.button-slider.button-slider--status-off {
    background-color: rgba(255, 66, 66, 0.4);
    color: #FF4242;
}

</style>