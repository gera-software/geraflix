<template>
    <div class="container-center">
        <h1>Geraflix</h1>
        <h2>Compartilhe momentos cinematográficos à distância!</h2>
        <button class="btn-primary">Criar sala</button>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.container-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
}

.btn-primary {
    background-color: #F5811B;
    border: none;
    padding: 20px;
    font-size: 1.2em;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #f18f3a;
}

.btn-primary:active {
    background-color: #cc6c18;
}
</style>
