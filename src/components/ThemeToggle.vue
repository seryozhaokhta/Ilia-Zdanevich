<!-- src/components/ThemeToggle.vue -->

<template>
    <button @click="toggleTheme" class="theme-toggle" aria-label="Переключить тему">
        <img :src="currentIcon" alt="Toggle Theme" />
    </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import sunIcon from '../assets/images/sun.svg'
import moonIcon from '../assets/images/moon.svg'

export default defineComponent({
    name: 'ThemeToggle',
    setup() {
        const isDark = ref(false)
        const currentIcon = ref(moonIcon)

        const toggleTheme = () => {
            isDark.value = !isDark.value
            if (isDark.value) {
                document.documentElement.classList.add('dark-theme')
                currentIcon.value = sunIcon
            } else {
                document.documentElement.classList.remove('dark-theme')
                currentIcon.value = moonIcon
            }
        }

        onMounted(() => {
            // Проверка сохранённой темы в localStorage
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme === 'dark') {
                isDark.value = true
                document.documentElement.classList.add('dark-theme')
                currentIcon.value = sunIcon
            } else {
                isDark.value = false
                document.documentElement.classList.remove('dark-theme')
                currentIcon.value = moonIcon
            }
        })

        watch(isDark, (newVal) => {
            localStorage.setItem('theme', newVal ? 'dark' : 'light')
        })

        return {
            toggleTheme,
            currentIcon
        }
    }
})
</script>

<style scoped>
.theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-toggle img {
    width: 24px;
    height: 24px;
    transition: transform 0.3s;
}

.theme-toggle:hover img {
    transform: scale(1.1);
}
</style>

