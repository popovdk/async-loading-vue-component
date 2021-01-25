<template>
  <div>
    <h2> <slot name="title" /> </h2>
    <h3> <slot /> </h3>
    <yandex-map
      :coords="coords"
      :zoom="zoom"
      class="test"
      @click="$emit('click', $event)"
    >
      <!--Markers-->
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap } from 'vue-yandex-maps'
export default {
  name: 'MapLocation',
  props: {
    coords: {
      type: Array
    },
    zoom: {
      type: [String, Number]
    }
  },
  components: {
    yandexMap
  }
}
</script>

<style lang="scss" scoped>
.test {
  width: 100%;
  height: 300px;
}
</style>
