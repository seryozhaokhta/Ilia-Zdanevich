<!-- src/components/HomeBanner.vue -->

<template>
    <div class="home-banner">
        <!-- Контейнер для p5.js канваса -->
        <div ref="p5Container"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import p5 from 'p5'

// Ссылка на контейнер для канваса
const p5Container = ref<HTMLDivElement | null>(null)
let sketch: p5

// Массив букв для отображения на двух строках
const letters = ["ИЛЬЯ", "ЗДНАНЕВИЧ"].map(line => line.split(""))

/**
 * Интерфейс для хранения данных о каждой букве без прозрачности
 */
interface Letter {
    char: string
    currentX: number
    currentY: number
    targetX: number
    targetY: number
}

// Массив для хранения данных букв
let lettersData: Letter[] = []

// Параметры анимации
const lerpSpeed = 0.025

// Позиции курсора мыши
let mouseXPos = window.innerWidth / 2
let mouseYPos = window.innerHeight / 2

// Состояние анимации
enum AnimationState {
    INITIAL = 'INITIAL',
    CHAOS = 'CHAOS'
}

let state: AnimationState = AnimationState.INITIAL

// Обработчик движения мыши
const handleMouseMove = (event: MouseEvent) => {
    mouseXPos = event.clientX
    mouseYPos = event.clientY
}

// Константы для отступов и промежутков
const marginX = -50
const marginY = -150
const lineSpacing = 200 // Увеличен отступ между строками
const spaceBetweenLetters = 10 // Минимальное расстояние между буквами

onMounted(() => {
    // Добавляем слушатель события движения мыши
    window.addEventListener('mousemove', handleMouseMove)

    // Определяем p5.js скетч
    const s = (p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight)
            p.textFont("Helvetica")
            p.textSize(240) // Увеличен размер шрифта
            p.textAlign(p.LEFT, p.TOP) // Выравнивание по левому верхнему углу

            let currentY = marginY

            // Очистка lettersData перед инициализацией
            lettersData = []

            letters.forEach(line => { // каждая строка - массив символов
                let currentX = marginX

                line.forEach(char => {
                    const letterWidth = p.textWidth(char)
                    const letterHeight = p.textAscent() + p.textDescent()
                    const pos = {
                        x: currentX + letterWidth / 2,
                        y: currentY + letterHeight / 2,
                    }
                    lettersData.push({
                        char,
                        currentX: pos.x,
                        currentY: pos.y,
                        targetX: pos.x,
                        targetY: pos.y,
                    })
                    currentX += letterWidth + spaceBetweenLetters
                })

                currentY += lineSpacing // переход на следующую строку
            })
        }

        p.draw = () => {
            // Считываем текущие CSS-переменные для фона и текста
            const computedStyle = getComputedStyle(document.documentElement)
            const bgHex = computedStyle.getPropertyValue('--background-color').trim() || '#FFFFFF'
            const textHex = computedStyle.getPropertyValue('--text-color').trim() || '#000000'

            // Функция для конвертации HEX в RGB
            const hexToRgb = (hex: string): [number, number, number] => {
                hex = hex.replace('#', '').trim()
                if (hex.length === 3) {
                    hex = hex.split('').map(c => c + c).join('')
                }
                const bigint = parseInt(hex, 16)
                const r = (bigint >> 16) & 255
                const g = (bigint >> 8) & 255
                const b = bigint & 255
                return [r, g, b]
            }

            // Преобразуем HEX-цвета в RGB
            const bgColor = hexToRgb(bgHex)
            const textColor = hexToRgb(textHex)

            // Устанавливаем фон канваса
            p.background(...bgColor)

            // Определяем текущее состояние на основе позиции курсора
            const newState = mouseXPos >= p.width / 2 ? AnimationState.CHAOS : AnimationState.INITIAL
            if (newState !== state) {
                state = newState
                if (state === AnimationState.CHAOS) {
                    setChaosPositions(p)
                } else {
                    setInitialPositions(p)
                }
            }

            // Обрабатываем каждую букву
            lettersData.forEach(letter => {
                // Плавное движение к целевой позиции
                letter.currentX = p.lerp(letter.currentX, letter.targetX, lerpSpeed)
                letter.currentY = p.lerp(letter.currentY, letter.targetY, lerpSpeed)

                // Устанавливаем цвет текста без прозрачности
                p.fill(...textColor)
                p.text(letter.char, letter.currentX, letter.currentY)
            })
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight)
            // Пересчитываем позиции букв при изменении размера окна
            lettersData = []

            let currentY = marginY

            letters.forEach(line => { // итерация по строкам
                let currentX = marginX

                line.forEach(char => { // итерация по символам
                    const letterWidth = p.textWidth(char)
                    const letterHeight = p.textAscent() + p.textDescent()
                    const pos = {
                        x: currentX + letterWidth / 2,
                        y: currentY + letterHeight / 2
                    }
                    lettersData.push({
                        char,
                        currentX: pos.x,
                        currentY: pos.y,
                        targetX: pos.x,
                        targetY: pos.y
                    })
                    currentX += letterWidth + spaceBetweenLetters
                })

                currentY += lineSpacing
            })

            // Если состояние CHAOS, установить хаотичные позиции
            if (state === AnimationState.CHAOS) {
                setChaosPositions(p)
            }
        }

        /**
         * Функция установки начальных позиций для букв
         */
        const setInitialPositions = (p: p5) => {
            let currentY = marginY
            let letterIndex = 0

            letters.forEach(line => {
                let currentX = marginX

                line.forEach(char => {
                    const letter = lettersData[letterIndex]
                    const letterWidth = p.textWidth(char)
                    const letterHeight = p.textAscent() + p.textDescent()
                    letter.targetX = currentX + letterWidth / 2
                    letter.targetY = currentY + letterHeight / 2
                    currentX += letterWidth + spaceBetweenLetters
                    letterIndex++
                })

                currentY += lineSpacing
            })
        }

        /**
         * Функция установки хаотичных позиций для букв
         */
        const setChaosPositions = (p: p5) => {
            lettersData.forEach(letter => {
                letter.targetX = p.random(p.width)
                letter.targetY = p.random(p.height)
            })
        }
    }

    // Создаём экземпляр p5.js скетча
    sketch = new p5(s, p5Container.value as HTMLElement)
})

onBeforeUnmount(() => {
    // Удаляем слушатель события движения мыши и уничтожаем скетч
    window.removeEventListener('mousemove', handleMouseMove)
    if (sketch) sketch.remove()
})
</script>

<style scoped>
.home-banner {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
