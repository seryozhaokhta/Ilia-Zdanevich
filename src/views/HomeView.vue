<!-- src/views/HomeView.vue -->

<template>
    <div class="home-view">
        <HeaderComponent />
        <div class="main-content">
            <HomeBanner />
            <BooksButton />
        </div>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import HomeBanner from '@/components/HomeBanner.vue'
import BooksButton from '@/components/BooksButton.vue'

export default defineComponent({
    name: 'HomeView',
    components: {
        HeaderComponent,
        FooterComponent,
        HomeBanner,
        BooksButton
    }
})
</script>

<style scoped>
.home-view {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

.main-content {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* Размещает BooksButton внизу */
    align-items: center;
    padding: 20px;
}
</style>
