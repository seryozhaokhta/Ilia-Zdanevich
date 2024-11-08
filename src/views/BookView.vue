<!-- src/views/BookView.vue -->
<template>
    <div class="book-view">
        <HeaderComponent />
        <div class="book-content" v-if="book && book.available">
            <h2>{{ book.title }}</h2>
            <p v-if="book.dedication"><em>{{ book.dedication }}</em></p>
            <div v-for="section in book.sections" :key="section.name" class="section">
                <h3>{{ section.name }}</h3>
                <p v-if="section.date"><small>{{ section.date }}</small></p> <!-- Отображение даты раздела -->
                <div v-for="stanza in section.stanzas" :key="stanza.number" class="stanza">
                    <h4>Стих {{ stanza.number }}</h4>
                    <p class="stanza-text">{{ stanza.text }}</p>
                </div>
            </div>
        </div>
        <div class="book-unavailable" v-else>
            <h2>Книга недоступна</h2>
            <p>Извините, информация по этой книге ещё не добавлена.</p>
        </div>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

import brigadnyData from '@/data/brigadny.json'
import afetData from '@/data/afet.json'
import rahelData from '@/data/rahel.json'
import prigovorBezmolvnnyData from '@/data/prigovor-bezmolvnny.json'
import boustrophedonMiroirData from '@/data/boustrophedon-au-miroir.json'

interface Stanza {
    number: number
    text: string
    date?: string | null
}

interface Section {
    name: string
    date: string
    stanzas: Stanza[]
}

interface Book {
    title: string
    dedication: string
    sections: Section[]
    available: boolean
}

export default defineComponent({
    name: 'BookView',
    components: {
        HeaderComponent,
        FooterComponent
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const book = ref<Book | null>(null)

        onMounted(() => {
            // Загрузка данных книги по id
            switch (props.id) {
                case "Бригадный":
                    book.value = { ...brigadnyData, available: true } as Book
                    break
                case "Афет":
                    book.value = { ...afetData, available: true } as Book
                    break
                case "Rahel":
                    book.value = { ...rahelData, available: true } as Book
                    break
                case "Приговор безмолвный":
                    book.value = { ...prigovorBezmolvnnyData, available: true } as Book
                    break
                case "Boustrophédon au miroir":
                    book.value = { ...boustrophedonMiroirData, available: true } as Book
                    break
                default:
                    // Для остальных книг пока нет данных
                    book.value = {
                        title: props.id,
                        dedication: "",
                        sections: [],
                        available: false
                    } as Book
            }
        })

        return {
            book
        }
    }
})
</script>

<style scoped>
.book-view {
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

.book-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.book-unavailable {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
}

.section {
    margin-top: 20px;
}

.stanza {
    margin-bottom: 15px;
}

.stanza-text {
    white-space: pre-line;
    /* Сохраняет переносы строк */
}
</style>
