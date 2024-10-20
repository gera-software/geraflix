<template>
    <svg :width="width" :height="height" viewBox="0 0 25 18"  xmlns="http://www.w3.org/2000/svg">
        <g :fill="iconColor">
            <path d="M0 3.5C0 1.9832 1.2332 0.75 2.75 0.75H13.75C15.2668 0.75 16.5 1.9832 16.5 3.5V14.5C16.5 16.0168 15.2668 17.25 13.75 17.25H2.75C1.2332 17.25 0 16.0168 0 14.5V3.5ZM24.0238 2.28828C24.4707 2.52891 24.75 2.99297 24.75 3.5V14.5C24.75 15.007 24.4707 15.4711 24.0238 15.7117C23.577 15.9523 23.0355 15.9266 22.6102 15.643L18.4852 12.893L17.875 12.4848V11.75V6.25V5.51523L18.4852 5.10703L22.6102 2.35703C23.0313 2.07773 23.5727 2.04766 24.0238 2.28828Z"/>
        </g>
    </svg>
</template>
<script setup lang="ts">
interface Props {
    width?: number
    height?: number
    iconColor?: string
}

const { width = 25 , height = 18, iconColor = 'black' } = defineProps<Props>()
</script>