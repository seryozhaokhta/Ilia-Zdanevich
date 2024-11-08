<!-- src/components/HeaderComponent.vue -->

<template>
    <header class="header">
        <nav class="nav">
            <router-link to="/" class="nav-link">Главная</router-link>
            <ThemeToggle />
        </nav>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

export default defineComponent({
    name: 'HeaderComponent',
    components: {
        ThemeToggle
    }
})
</script>

<style scoped>
.header {
    background-color: var(--header-background);
    color: var(--header-text-color);
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.nav-link {
    color: var(--header-text-color);
    text-decoration: none;
    font-size: 18px;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #ddd;
}

@media (max-width: 600px) {
    .nav-link {
        font-size: 16px;
    }
}
</style>
