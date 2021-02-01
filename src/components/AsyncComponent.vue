<script>
/**
 * Компонент принимает на себя пропсы, эвенты, слоты
 * будущего комопнента который загрузит AsyncLoading
 */
export default {
  name: 'AsyncComponent',
  inheritAttrs: false,
  render (h) {
    const { $attrs, $listeners } = this
    const scopedSlots = Object.fromEntries(Object.entries(this.$slots).map(([key, value]) => [key, () => value]))
    return h(
      this.$parent.chunk,
      {
        props: $attrs,
        scopedSlots,
        on: $listeners
      }
    )
  },
  data () {
    return {
      rendered: false
    }
  },
  updated () {
    if (!this.rendered) {
      this.$parent.$el.outerHTML = this.$el.outerHTML
      this.rendered = true
    }
  }
}
</script>
