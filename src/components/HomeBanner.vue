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

// Массивы букв для двух слов
const filledLetters = ["ИЛЬЯ", "ЗДАНЕВИЧ"].map(line => line.split(""))
const outlinedLetters = ["ИЛЬЯЗД"].map(line => line.split(""))

// Интерфейс для хранения данных о каждой букве
interface Letter {
    char: string
    currentX: number
    currentY: number
    targetX: number
    targetY: number
}

// Массивы для хранения данных букв
let filledLettersData: Letter[] = []
let outlinedLettersData: Letter[] = []

// Параметры анимации
const lerpSpeed = 0.025

// Позиция указателя по оси X (мышь или касание)
let pointerXPos = window.innerWidth / 2

// Состояние анимации
enum AnimationState {
    INITIAL = 'INITIAL',
    CHAOS = 'CHAOS'
}

let state: AnimationState = AnimationState.INITIAL

// Обработчик обновления позиции указателя по оси X
const handlePointerMove = (x: number) => {
    pointerXPos = x
}

// Ссылки на функции-обработчики для удаления слушателей событий
let mouseMoveHandler: (event: MouseEvent) => void
let touchMoveHandler: (event: TouchEvent) => void

// Константы для отступов и промежутков
let marginX = -50
let marginY = -150
let lineSpacing = 200 // Увеличенный отступ между строками
let spaceBetweenLetters = 10 // Минимальное расстояние между буквами

// Переменные для адаптивных параметров
let textSize = 240 // Размер текста по умолчанию
let outlinedStrokeWeight = 2 // Толщина обводки по умолчанию
let rotationAngle = 0 // Угол поворота по умолчанию (0 радиан)

onMounted(() => {
    // Определяем функции-обработчики
    mouseMoveHandler = (event: MouseEvent) => {
        handlePointerMove(event.clientX)
    }

    touchMoveHandler = (event: TouchEvent) => {
        if (event.touches.length > 0) {
            handlePointerMove(event.touches[0].clientX)
        }
    }

    // Добавляем слушатели событий для мыши и касаний
    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('touchmove', touchMoveHandler)

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

    // Определяем p5.js скетч
    const s = (p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight)
            p.textFont("Helvetica")
            p.textAlign(p.LEFT, p.TOP) // Выравнивание по левому верхнему углу

            // Устанавливаем размер текста и отступы в зависимости от ширины окна
            setResponsiveParameters(p)

            initializeLetters(p)
        }

        p.draw = () => {
            // Считываем текущие CSS-переменные для фона и текста
            const computedStyle = getComputedStyle(document.documentElement)
            const bgHex = computedStyle.getPropertyValue('--background-color').trim() || '#FFFFFF'
            const textHex = computedStyle.getPropertyValue('--text-color').trim() || '#000000'

            // Преобразуем HEX-цвета в RGB
            const bgColor = hexToRgb(bgHex)
            const textColor = hexToRgb(textHex)

            // Устанавливаем фон канваса
            p.background(...bgColor)

            // Определяем текущее состояние на основе позиции указателя
            const newState = pointerXPos >= p.width / 2 ? AnimationState.CHAOS : AnimationState.INITIAL
            if (newState !== state) {
                state = newState
                if (state === AnimationState.CHAOS) {
                    setChaosPositions(p, filledLettersData)
                    setInitialPositions(p, outlinedLettersData)
                } else {
                    setInitialPositions(p, filledLettersData)
                    setChaosPositions(p, outlinedLettersData)
                }
            }

            // Применяем поворот
            p.push()
            // Переносим начало координат в центр экрана
            p.translate(p.width / 2, p.height / 2)
            // Поворачиваем на заданный угол
            p.rotate(rotationAngle)
            // Возвращаем начало координат
            p.translate(-p.width / 2, -p.height / 2)

            // Отрисовываем буквы
            drawLetters(p, filledLettersData, 'filled', textColor)
            drawLetters(p, outlinedLettersData, 'outlined', textColor)

            p.pop()
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight)
            // Пересчитываем параметры и позиции букв при изменении размера окна
            setResponsiveParameters(p)
            initializeLetters(p)
        }

        /**
         * Функция установки параметров в зависимости от ширины окна
         */
        const setResponsiveParameters = (p: p5) => {
            if (p.windowWidth < 768) {
                // Мобильное устройство
                textSize = 90 // Размер шрифта для мобильных устройств
                marginX = -170
                marginY = 200
                lineSpacing = 80
                spaceBetweenLetters = 5
                outlinedStrokeWeight = 1 // Толщина обводки для мобильных устройств
                rotationAngle = p.radians(-90) // Угол поворота для мобильных устройств (-90 градусов)
            } else {
                // Десктоп
                textSize = 240 // Размер шрифта для десктопов
                marginX = -50
                marginY = -150
                lineSpacing = 200
                spaceBetweenLetters = 10
                outlinedStrokeWeight = 2 // Толщина обводки для десктопов
                rotationAngle = 0 // Без поворота на десктопах
            }
            p.textSize(textSize)
        }

        /**
         * Функция отрисовки букв
         */
        const drawLetters = (p: p5, lettersDataArray: Letter[], drawStyle: 'filled' | 'outlined', textColor: [number, number, number]) => {
            lettersDataArray.forEach(letter => {
                // Плавное движение к целевой позиции
                letter.currentX = p.lerp(letter.currentX, letter.targetX, lerpSpeed)
                letter.currentY = p.lerp(letter.currentY, letter.targetY, lerpSpeed)

                if (drawStyle === 'filled') {
                    // Устанавливаем цвет текста без прозрачности
                    p.fill(...textColor)
                    p.noStroke()
                } else if (drawStyle === 'outlined') {
                    // Устанавливаем контур текста
                    p.noFill()
                    p.stroke(...textColor)
                    p.strokeWeight(outlinedStrokeWeight)
                }

                p.text(letter.char, letter.currentX, letter.currentY)
            })
        }

        /**
         * Функция установки начальных позиций для букв
         */
        const setInitialPositions = (p: p5, lettersDataArray: Letter[]) => {
            let currentY = marginY
            let letterIndex = 0

            const lettersArray = lettersDataArray === filledLettersData ? filledLetters : outlinedLetters

            lettersArray.forEach(line => {
                let currentX = marginX

                line.forEach(char => {
                    const letter = lettersDataArray[letterIndex]
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
        const setChaosPositions = (p: p5, lettersDataArray: Letter[]) => {
            lettersDataArray.forEach(letter => {
                letter.targetX = p.random(p.width)
                letter.targetY = p.random(p.height)
            })
        }

        /**
         * Функция инициализации позиций букв (используется при ресайзе)
         */
        const initializeLetters = (p: p5) => {
            // Создание данных для букв
            filledLettersData = createLettersData(p, filledLetters)
            outlinedLettersData = createLettersData(p, outlinedLetters)

            // Устанавливаем начальные или хаотичные позиции в зависимости от состояния
            if (state === AnimationState.CHAOS) {
                setChaosPositions(p, filledLettersData)
                setInitialPositions(p, outlinedLettersData)
            } else {
                setInitialPositions(p, filledLettersData)
                setChaosPositions(p, outlinedLettersData)
            }
        }

        /**
         * Функция создания данных букв
         */
        const createLettersData = (p: p5, lettersArray: string[][]): Letter[] => {
            const lettersData: Letter[] = []
            let currentY = marginY

            lettersArray.forEach(line => {
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

                currentY += lineSpacing
            })

            return lettersData
        }
    }

    // Создаём экземпляр p5.js скетча
    if (p5Container.value) {
        sketch = new p5(s, p5Container.value)
    }
})

onBeforeUnmount(() => {
    // Удаляем слушатели событий и уничтожаем скетч
    window.removeEventListener('mousemove', mouseMoveHandler)
    window.removeEventListener('touchmove', touchMoveHandler)
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
