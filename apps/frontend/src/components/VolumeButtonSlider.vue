<template>
    <BaseButtonSlider :title="`Volume ${sliderValue * 100}%`" :variant="variant" v-model="sliderValue" :disabled="disabled" :min="0" :max="1">
        <template #icon>
            <IconVolumeXMark v-if="sliderValue == 0"/>
            <IconVolumeHigh v-else />
        </template>
    </BaseButtonSlider>
</template>
<script setup lang="ts">
import BaseButtonSlider from './BaseButtonSlider.vue';
import IconVolumeXMark from './icons/IconVolumeXMark.vue';
import IconVolumeHigh from './icons/IconVolumeHigh.vue';
import { ref, watch } from 'vue';

interface Props {
    variant?: 'secondary' | 'danger' | 'status-on' | 'status-off'
    disabled?: boolean
    modelValue: number
}

const emit = defineEmits(['update:modelValue'])

const { variant = 'secondary', disabled = false, modelValue } = defineProps<Props>()

const sliderValue = ref(modelValue)

watch(() => modelValue, () => {
    sliderValue.value = modelValue
})

watch(sliderValue, () => {
    emit('update:modelValue', sliderValue.value)
})

</script>