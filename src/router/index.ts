// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const HomeView = () => import('@/views/HomeView.vue')
const BookView = () => import('@/views/BookView.vue')

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/books/:id',
        name: 'Book',
        component: BookView,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
