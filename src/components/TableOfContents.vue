<!-- src/components/TableOfContents.vue -->

<template>
    <div>
        <!-- Кнопка для открытия/закрытия оглавления -->
        <button class="toc-toggle" @click="toggleToc" aria-label="Toggle Table of Contents">
            <span v-if="!isTocOpen">☰</span> <!-- Символ открытия -->
            <span v-else>✖</span> <!-- Символ закрытия -->
        </button>

        <!-- Само оглавление -->
        <nav :class="['toc', { 'toc-open': isTocOpen }]">
            <h3>Оглавление</h3>
            <ul>
                <li v-for="section in book.sections" :key="section.name" class="toc-section">
                    <span class="section-name">{{ section.name }}</span>
                    <ul>
                        <li v-for="stanza in section.stanzas" :key="stanza.number" class="toc-stanza">
                            <a href="#" @click.prevent="scrollToStanza(stanza.number)">
                                Стих {{ stanza.number }}: {{ getFirstLine(stanza.text) }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <!-- Overlay при открытом TOC для закрытия при клике вне оглавления -->
        <div v-if="isTocOpen" class="toc-overlay" @click="toggleToc"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

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
    name: 'TableOfContents',
    props: {
        book: {
            type: Object as PropType<Book>,
            required: true
        },
        isTocOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:isTocOpen'],
    setup(props, { emit }) {
        const toggleToc = () => {
            emit('update:isTocOpen', !props.isTocOpen)
        }

        const scrollToStanza = (stanzaNumber: number) => {
            const element = document.getElementById(`stanza-${stanzaNumber}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                // Закрыть оглавление после клика
                emit('update:isTocOpen', false)
            }
        }

        const getFirstLine = (text: string) => {
            return text.split('\n')[0]
        }

        return {
            toggleToc,
            scrollToStanza,
            getFirstLine
        }
    }
})
</script>

<style scoped>
/* Стили для кнопки оглавления */
.toc-toggle {
    position: fixed;
    top: 15px;
    left: 20px;
    z-index: 1500;
    /* Выше TOC и overlay */
    background-color: rgba(255, 255, 255, 0.8);
    color: var(--text-color);
    border: none;
    width: 40px;
    /* Фиксированная ширина */
    height: 40px;
    /* Фиксированная высота */
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    /* Используем Flexbox для центрирования */
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
}

.toc-toggle:hover {
    background-color: rgba(240, 240, 240, 0.9);
    transform: scale(1.1);
}

/* Стили для оглавления */
.toc {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    max-width: 80%;
    height: 100%;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    padding: 20px;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
    z-index: 1400;
}

.toc-open {
    transform: translateX(0);
}

.toc h3 {
    margin-top: 0;
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
}

.toc ul {
    list-style: none;
    padding-left: 0;
}

.toc-section {
    margin-bottom: 15px;
}

.section-name {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    font-size: 18px;
}

.toc-stanza a {
    color: var(--text-color);
    text-decoration: none;
    display: block;
    padding: 5px 0;
    transition: color 0.3s;
    font-size: 16px;
}

.toc-stanza a:hover {
    text-decoration: underline;
    color: var(--hover-text-color);
}

/* Подсветка активного стиха */
.active-stanza a {
    background-color: rgba(0, 0, 0, 0.05);
    border-left: 4px solid var(--hover-text-color);
}

/* Overlay при открытом TOC */
.toc-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1300;
}

/* Адаптивность */
@media (max-width: 768px) {
    .toc {
        width: 80%;
    }

    .toc-toggle {
        top: 15px;
        left: 15px;
        padding: 10px;
        font-size: 18px;
        width: 35px;
        /* Подогнанные размеры для мобильных */
        height: 35px;
    }

    .toc h3 {
        font-size: 20px;
    }

    .section-name {
        font-size: 16px;
    }

    .toc-stanza a {
        font-size: 14px;
    }

    /* Подсветка активного стиха на мобильных */
    .active-stanza a {
        border-left: 3px solid var(--hover-text-color);
    }
}
</style>
