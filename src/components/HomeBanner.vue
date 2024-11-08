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

// Массив букв для отображения
const letters = "ИЛЬЯ ЗДНАНЕВИЧ".split("")

// Массивы для хранения позиций букв
let positions: { x: number; y: number; opacity: number }[] = []
let basePositions: { x: number; y: number }[] = []

// Параметры анимации
const maxDist = 100
const chaosFactorX = 1080
const chaosFactorY = 400
const lerpSpeed = 0.05

// Позиции курсора мыши
let mouseXPos = window.innerWidth / 2
let mouseYPos = window.innerHeight / 2

// Обработчик движения мыши
const handleMouseMove = (event: MouseEvent) => {
    mouseXPos = event.clientX
    mouseYPos = event.clientY
}

onMounted(() => {
    // Добавляем слушатель события движения мыши
    window.addEventListener('mousemove', handleMouseMove)

    // Определяем p5.js скетч
    const s = (p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight)
            p.textFont('Helvetica')
            p.textSize(164)
            p.textAlign(p.CENTER, p.CENTER)

            const totalWidth = p.textWidth(letters.join(""))
            let startX = (p.width - totalWidth) / 2
            const centerY = p.height / 2

            // Инициализируем позиции букв
            for (let i = 0; i < letters.length; i++) {
                const letterWidth = p.textWidth(letters[i])
                const pos = { x: startX + letterWidth / 2, y: centerY }
                positions.push({ ...pos, opacity: p.random() > 0.5 ? 0.5 : 1 })
                basePositions.push(pos)
                startX += letterWidth
            }
        }

        p.draw = () => {
            // Считываем текущие CSS-переменные для фона и текста
            const computedStyle = getComputedStyle(document.documentElement)
            const bgHex = computedStyle.getPropertyValue('--background-color').trim()
            const textHex = computedStyle.getPropertyValue('--text-color').trim()

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

            // Обрабатываем каждую букву
            for (let i = 0; i < letters.length; i++) {
                let pos = positions[i]
                let basePos = basePositions[i]

                const distToCursor = p.dist(mouseXPos, mouseYPos, p.width / 2, p.height / 2)
                let offsetX = p.map(distToCursor, 0, maxDist, 0, chaosFactorX)
                let offsetY = p.map(distToCursor, 0, maxDist, 0, chaosFactorY)

                offsetX = p.constrain(offsetX, 0, chaosFactorX)
                offsetY = p.constrain(offsetY, 0, chaosFactorY)

                if (distToCursor < 150) {
                    pos.x = p.lerp(pos.x, basePos.x, lerpSpeed)
                    pos.y = p.lerp(pos.y, basePos.y, lerpSpeed)
                } else {
                    const angle = p.map(i, 0, letters.length, 0, p.TWO_PI)
                    const smoothOffsetX = p.sin(angle) * offsetX
                    const smoothOffsetY = p.cos(angle) * offsetY

                    pos.x = p.lerp(pos.x, basePos.x + smoothOffsetX, lerpSpeed)
                    pos.y = p.lerp(pos.y, basePos.y + smoothOffsetY, lerpSpeed)
                }

                pos.x = p.constrain(pos.x, 0, p.width)
                pos.y = p.constrain(pos.y, 0, p.height)

                p.push()
                p.fill(...textColor, 255 * pos.opacity)
                p.text(letters[i], pos.x, pos.y)
                p.pop()
            }
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight)
            basePositions = []
            positions = []

            const totalWidth = p.textWidth(letters.join(""))
            let startX = (p.width - totalWidth) / 2
            const centerY = p.height / 2

            for (let i = 0; i < letters.length; i++) {
                const letterWidth = p.textWidth(letters[i])
                const pos = { x: startX + letterWidth / 2, y: centerY }
                basePositions.push(pos)
                positions[i] = { ...pos, opacity: p.random() > 0.5 ? 0.5 : 1 }
                startX += letterWidth
            }
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

/* Временный дополнительный контент для тестирования прокрутки */
.extra-content {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
}
</style>
