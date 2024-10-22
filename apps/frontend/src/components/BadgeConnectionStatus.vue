<template>
    <BaseBadge class="badge-connection-status" is-dot :background-color="connectionStatus ? '#2DAA4E' : '#FF4242'" :title="connectionStatus ? 'online' : 'offline'"/>
</template>
<script setup lang="ts">
import BaseBadge from './BaseBadge.vue';

interface Props {
    connectionStatus?: boolean
}

defineProps<Props>()

</script>
<style scoped>
    .badge-connection-status {
        position: absolute;
        bottom: -2px;
        right: -4px;
    }
</style>