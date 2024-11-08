<!-- src/components/BookList.vue -->

<template>
    <ul class="book-list">
        <BookItem v-for="book in books" :key="book.title" :book="book" />
    </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BookItem from './BookItem.vue'

interface Book {
    title: string
    dedication: string
    sections: any[]
    available: boolean
}

export default defineComponent({
    name: 'BookList',
    components: {
        BookItem
    },
    props: {
        books: {
            type: Array as PropType<Book[]>,
            required: true
        }
    }
})
</script>

<style scoped>
.book-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
