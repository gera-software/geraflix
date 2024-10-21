<template>
    <button class="button-icon" :class="{ 'button-icon--secondary': variant == 'secondary', 'button-icon--danger': variant == 'danger', 'button-icon--status-on': variant == 'status-on', 'button-icon--status-off': variant == 'status-off'}" :disabled="disabled">
        <slot>
        </slot>
    </button>
</template>
<script lang="ts" setup>

interface Props {
    variant?: 'secondary' | 'danger' | 'status-on' | 'status-off'
    disabled?: boolean
}

const { variant = null, disabled = false } = defineProps<Props>()
</script>
<style scoped>
.button-icon {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 100%;
    text-align: center;
    cursor: pointer;

    background-color: #2F3136;
    color: white;
    overflow: hidden;
    z-index: 0;
}

.button-icon:not(:disabled):before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: rgb(255, 255, 255);
    opacity: 0;
    transition: opacity .2s ease-in;
}

.button-icon:not(:disabled):hover:before {
    opacity: .15;
}

.button-icon:disabled {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.3) !important;
}


.button-icon.button-icon--secondary {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
}

.button-icon.button-icon--danger {
    background-color: #FF4242;
    color: white;
}

.button-icon.button-icon--status-on {
    background-color: rgba(45, 170, 78, 0.4);
    color: #2DAA4E;
}

.button-icon.button-icon--status-off {
    background-color: rgba(255, 66, 66, 0.4);
    color: #FF4242;
}




</style>