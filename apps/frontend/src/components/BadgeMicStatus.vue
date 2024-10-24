<template>
    <BaseBadge class="badge-mic-status" background-color="#303030" :title="micStatus ? 'mic on' : 'mic off'">
        <IconMicrophone v-if="micStatus" :width="15" :height="12" icon-color="#2DAA4E" />
        <IconMicrophoneSlash v-else :width="15" :height="12" icon-color="#FF4242" />
    </BaseBadge>
</template>
<script setup lang="ts">
import BaseBadge from './BaseBadge.vue';
import IconMicrophone from './icons/IconMicrophone.vue';
import IconMicrophoneSlash from './icons/IconMicrophoneSlash.vue';

interface Props {
    micStatus?: boolean
}

defineProps<Props>()

</script>
<style scoped>
    .badge-mic-status {
        position: absolute;
        bottom: -8px;
        right: -8px;
    }
</style>