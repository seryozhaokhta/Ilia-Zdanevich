<!-- src/components/BooksButton.vue -->

<template>
    <div class="books-button" @mouseenter="showList = true" @mouseleave="showList = false">
        <button>Поэтические книги. 1940–1971</button>
        <BookList v-if="showList" :books="books" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BookList from './BookList.vue'

interface Book {
    title: string
    dedication: string
    sections: any[]
    available: boolean
}

export default defineComponent({
    name: 'BooksButton',
    components: {
        BookList
    },
    setup() {
        const showList = ref(false)
        const books: Book[] = [
            {
                title: "Афет",
                dedication: "Посвящается...",
                sections: [], // Заполните позже или оставьте пустым
                available: true
            },
            {
                title: "Rahel",
                dedication: "Посвящается...",
                sections: [],
                available: true
            },
            {
                title: "Бригадный",
                dedication: "Тех памяти кто не вышли из лагерей",
                sections: [],
                available: true
            },
            {
                title: "Приговор безмолвный",
                dedication: "Посвящается...",
                sections: [],
                available: true
            },
            {
                title: "Boustrophédon au miroir",
                dedication: "Посвящается...",
                sections: [],
                available: true
            }
        ]

        return {
            showList,
            books
        }
    }
})
</script>

<style scoped>
.books-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    z-index: 1000;
    /* Ensure it's above other elements */
}

.books-button button {
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.books-button button:hover {
    background-color: #555;
}

.books-list {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border: 1px solid #ccc;
    list-style: none;
    padding: 10px;
    margin: 10px 0 0 0;
    z-index: 1000;
    width: 220px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}

.books-list li {
    margin: 5px 0;
}

.books-list li a {
    text-decoration: none;
    color: #333;
    display: block;
    opacity: 1;
    transition: opacity 0.3s;
}

.books-list li a.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
}

.books-list li a:hover:not(.unavailable) {
    text-decoration: underline;
}
</style>
