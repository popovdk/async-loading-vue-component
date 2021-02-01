<template>
  <div id="app">
    <div style="height: 1500px; background: green; color: white; padding: 10px; font-size: 36px;">
      Cкрольте вниз, компонент еще не загружен
    </div>
    <div style="height: 300px; background: red; color: white; padding: 10px; font-size: 36px;">
      При достижении этой области начнется сразу загрузка компонента, благодаря root-margin = 300px и threshold = 0
    </div>
    {{ mapCoords }}
    <button @click="mapCoords = [54, 20]"> Тест реактивности пропсов </button>
    <async-loading
      :component="() => import('@/components/MapLocation')"
      :threshold="0"
      root-margin="300px"
    >
      <async-component
        id="test-id"
        class="test-css-class test-class"
        :current-coords="mapCoords"
        zoom="10"
        @click="clickHandler"
      >
        Какой то текст в default слота
        <template #title> Тестовый заголовок из слота title </template>
      </async-component>
      <loader slot="loader"/>
    </async-loading>
    <div style="height: 300px; background: red; color: white; padding: 10px; font-size: 36px;">
      При достижении этой области начнется сразу загрузка компонента, благодаря root-margin = 300px и threshold = 0
    </div>
    <div style="height: 2000px; background: green;" ref="test" />
  </div>
</template>

<script>
import AsyncLoading from '@/components/AsyncLoading'
import AsyncComponent from '@/components/AsyncComponent'
import Loader from '@/components/Loader'
export default {
  components: {
    Loader,
    AsyncComponent,
    AsyncLoading
  },
  data () {
    return {
      mapCoords: [
        54.82896654088406,
        39.831893822753904
      ]
    }
  },
  methods: {
    clickHandler (event) {
      console.log('click map emit', event)
    }
  }
}
</script>

<style lang="scss">
</style>
