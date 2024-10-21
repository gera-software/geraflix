<template>
    <div ref="bar" class="slider" @mousedown="onSliderMouseDown">
      <div class="slider__bar">
        <div ref="handle" class="slider__handle" :style="handleStyle"></div>
        <div class="slider__fill" :style="fillStyle"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { clamp, inverseLerp } from '../helpers/utils'
  import { useResizeObserver } from '@vueuse/core'
  import { computed, ref } from 'vue'
  
  export interface Props {
    min?: number
    max?: number
    disabled?: boolean
    modelValue: number
  }
  
  const emit = defineEmits(['update:modelValue'])
  
  const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1,
    disabled: false
  })
  
  const isDragging = ref(false)
  const barWidth = ref(0)
  
  const bar = ref()
  const handle = ref()
  
  useResizeObserver(bar, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    barWidth.value = width
  })
  
  const delta = computed(() => {
    const value = clamp(props.modelValue, props.min, props.max)
    const percent = inverseLerp(props.min, props.max, value)
    return percent
    // return (value - props.min) / (props.max - props.min)
  })
  
  const fillStyle = computed(() => {
    return {
      transformOrigin: 'left center',
      transform: `scaleX(${delta.value})`
    }
  })
  
  const handleStyle = computed(() => {
    return {
      transform: `translateX(${barWidth.value * delta.value}px)`
    }
  })
  
  function valueChanged(value: number) {
    emit('update:modelValue', value)
  }
  
  function parseMouseMove(e: MouseEvent) {
    // const offsetX = e.offsetX
    const offsetX = e.clientX - bar.value.getBoundingClientRect().x
    const normalizedValue = offsetX / barWidth.value
    const value = normalizedValue * (props.max - props.min) + props.min
  
    valueChanged(clamp(value, props.min, props.max))
  }
  
  function handleStart(e: MouseEvent) {
    isDragging.value = true
  
    parseMouseMove(e)
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleStop(_e: MouseEvent) {
    isDragging.value = false
  }
  
  function onSliderMouseDown(e: MouseEvent) {
    e.preventDefault()
    // console.log('onSliderMouseDown')
    handleStart(e)
  
    // window.addEventListener('mousemove', onMouseMove, { passive: true, capture: true })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onSliderMouseUp, { passive: false })
  }
  
  function onMouseMove(e: MouseEvent) {
    // console.log('onMouseMove')
    // TODO throttle
    if (isDragging.value) {
      parseMouseMove(e)
    }
  }
  
  function onSliderMouseUp(e: MouseEvent) {
    // console.log('onSliderMouseUp')
    e.stopPropagation()
    e.preventDefault()
  
    handleStop(e)
  
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onSliderMouseUp)
  }
  </script>
  
  <style scoped>
  .slider {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 24px;
    position: relative;
    /* user-select: none; */
  }
  
  .slider__bar {
    width: 100%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    pointer-events: none;
  }
  
  .slider__handle {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: calc(50% - (var(--size) / 2));
    z-index: 2;
    margin-left: calc(var(--size) / -2);
    pointer-events: none;
  }
  
  .slider__handle::after {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: white;
    display: block;
    scale: 0.2;
    transition: scale 200ms ease-out;
  }
  
  .slider:hover .slider__handle::after {
    scale: 1;
  }
  
  .slider__fill {
    height: 100%;
    width: 100%;
    background-color: white;
    pointer-events: none;
  }
  </style>