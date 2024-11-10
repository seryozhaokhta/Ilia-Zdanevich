<!-- src/views/BookView.vue -->

<template>
    <div class="book-view">
        <HeaderComponent />
        <div :class="['book-container', { 'toc-open': isTocOpen }]">
            <!-- Включаем оглавление и передаём состояние и события -->
            <TableOfContents v-if="book && book.available" :book="book" :isTocOpen="isTocOpen"
                @update:isTocOpen="isTocOpen = $event" />

            <div class="book-content" v-if="book && book.available">
                <h2>{{ book.title }}</h2>
                <p v-if="book.dedication"><em>{{ book.dedication }}</em></p>
                <div v-for="section in book.sections" :key="section.name" class="section">
                    <h3>{{ section.name }}</h3>
                    <p v-if="section.date"><small>{{ section.date }}</small></p>
                    <div v-for="stanza in section.stanzas" :key="stanza.number" class="stanza"
                        :id="`stanza-${stanza.number}`">
                        <!-- Проверяем, если книга не "Я бывший человек", тогда показываем заголовок h4 -->
                        <h4 v-if="book.title !== 'Я бывший человек меня к чему…'">Стих {{ stanza.number }}</h4>
                        <p class="stanza-text">{{ stanza.text }}</p>
                    </div>
                </div>
            </div>

            <div class="book-unavailable" v-else>
                <h2>Книга недоступна</h2>
                <p>Извините, информация по этой книге ещё не добавлена.</p>
            </div>
        </div>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import TableOfContents from '@/components/TableOfContents.vue'

import brigadnyData from '@/data/brigadny.json'
import afetData from '@/data/afet.json'
import rahelData from '@/data/rahel.json'
import prigovorData from '@/data/prigovor-bezmolvnny.json'
import boustrophedonData from '@/data/boustrophedon-au-miroir.json'
import byvshiyChelovekData from '@/data/byvshiy-chelovek.json'

interface Stanza {
    number: number
    text: string
    date?: string | null
}

interface Section {
    name: string
    date?: string | null
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
        FooterComponent,
        TableOfContents
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const book = ref<Book | null>(null)
        const isTocOpen = ref(false) // Управление состоянием TOC

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
                case "Приговор безмолвный": // Добавлено
                    book.value = { ...prigovorData, available: true } as Book
                    break
                case "Boustrophédon au miroir": // Добавлено
                    book.value = { ...boustrophedonData, available: true } as Book
                    break
                case "Я бывший человек меня к чему…":
                    book.value = { ...byvshiyChelovekData, available: true } as Book;
                    break;
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
            book,
            isTocOpen
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

.book-container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    position: relative;
    justify-content: center;
    /* Центрирование содержимого */
    align-items: flex-start;
    transition: margin-left 0.3s ease;
}

/* При открытом TOC добавляем отступ слева для основного контента */
.book-container.toc-open .book-content {
    margin-left: 320px;
    /* Ширина TOC (300px) + отступ (20px) */
}

.book-content {
    flex: 1;
    max-width: 800px;
    padding: 20px;
    transition: margin-left 0.3s ease;
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

/* Центрирование при закрытом TOC */
@media (min-width: 769px) {
    .book-container:not(.toc-open) .book-content {
        margin-left: 0;
        /* Без отступа */
    }
}

/* Дополнительные стили для заголовков и текстов */
.section h3 {
    font-size: 22px;
    margin-bottom: 10px;
}

.stanza h4 {
    font-size: 18px;
    margin-bottom: 5px;
}

.stanza-text {
    text-align: justify;
    line-height: 1.6;
    margin-bottom: 20px;
}
</style>
