<!-- src/components/FooterComponent.vue -->

<template>
    <footer class="footer">
        <p>&copy; 2024 Илья Зданевич. Все права защищены.</p>
    </footer>
</template>

<script lang="ts">
export default {
    name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
    background-color: var(--footer-background);
    color: var(--footer-text-color);
    padding: 10px;
    text-align: center;
    transition: background-color 0.3s, color 0.3s;
}
</style>
