<!-- src/components/BookItem.vue -->

<template>
    <li class="book-item">
        <router-link :to="book.available ? `/books/${encodeURIComponent(book.title)}` : '#'"
            :class="{ unavailable: !book.available }" @click.prevent="handleClick">
            {{ book.title }}
        </router-link>
    </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Book {
    title: string
    dedication: string
    sections: any[]
    available: boolean
}

export default defineComponent({
    name: 'BookItem',
    props: {
        book: {
            type: Object as () => Book,
            required: true
        }
    },
    setup(props) {
        const handleClick = (event: Event) => {
            if (!props.book.available) {
                event.preventDefault()
                alert('Данная книга пока недоступна.')
            }
        }

        return {
            handleClick
        }
    }
})
</script>

<style scoped>
.book-item {
    margin: 5px 0;
}

.book-item a {
    text-decoration: none;
    color: inherit;
    /* Используем цвет, определённый в main.css */
    display: block;
    opacity: 1;
    transition: color 0.3s, opacity 0.3s;
}

.book-item a.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
}

.book-item a:hover:not(.unavailable) {
    text-decoration: underline;
}
</style>
