<template>
    <div class="stream-preview" :class="remoteStream.type">
        <video ref="video" autoplay controls ></video>
        <div class="bottom-bar">
            [{{ `${remoteStream.type}` }}] {{ remoteStream.user?.name }} {{ remoteStream.user?.color }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RemoteStream } from '../helpers/temporaryTypes';

const props = defineProps<{
    remoteStream: RemoteStream,
    // FIX o video só é exibido se passar o mediaStream separado como prop, tem algo errado com a reatividade do remoteStream prop
    mediaStream: MediaStream,
}>()

// TODO show mic and cam status

const video = ref<HTMLVideoElement>()


watchEffect(() => {
    if(video.value) {
        video.value.srcObject = props.mediaStream
    }
})


</script>

<style scoped>

.stream-preview {
    background-color: rgb(50, 50, 50);
    width: 640px;
    height: 480px;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
}

.stream-preview video {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
}

.stream-preview.cam video {
    object-fit: cover;
}

.stream-preview.screen-share video {
    object-fit: contain;
}

.bottom-bar {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 8px;
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
}
</style>