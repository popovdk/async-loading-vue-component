<script>

/**
 * Компонент для асинхронной загрузки компонентов когда в зону просмотра
 * браузера пользователя попадает триггер.
 * Основан на IntersectionObserver - https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
 */

import Vue from 'vue'
export default {
  name: 'AsyncLoading',
  inheritAttrs: false,
  props: {
    /**
     * Функция асинхронного компонента,
     * например: () => import('@/components/MapLocation')
     */
    component: {
      type: Function,
      required: true
    },
    /**
     * Название тега тригера.
     */
    triggerTag: {
      type: String,
      default: 'div'
    },
    /**
     * Виртуальные отступы вокруг тригера которые позволяют расширить зону реагирования.
     * Могут иметь значения как свойство css margin: "10px 20px 30px 40px" (top, right, bottom, left).
     * Значения можно задавать в процентах. По умолчанию все параметры установлены в нули.
     */
    rootMargin: {
      type: String,
      default: '0px 0px 0px 0px'
    },
    /**
     * Число или массив чисел, указывающий, при каком проценте видимости целевого элемента должена начаться загрузка компонента.
     * Например, в этом случае будет начинаться загрузка при появлении в зоне видимости каждый 25% целевого элемента:  [0, 0.25, 0.5, 0.75, 1]
     */
    threshold: {
      type: [Number, Array],
      default: 0
    }
  },

  computed: {
    asyncComponent () {
      return { ...this.$slots.default[0] }
    }
  },

  render (createElement) {
    // Якорь для наблюдателя
    return createElement(this.triggerTag, this.$slots.loader || '')
  },

  mounted () {
    const handler = entries => {
      if (entries[0].isIntersecting) {
        this.$emit('intersecting', entries[0])
        // Отключаем наблюдетель, он больше не пригодится
        this.observer.disconnect()
        // Грузим чанк компонент
        this.component()
          .then(chunk => {
            this.$emit('loaded', chunk)
            // Собираем чанк в компонент
            const Component = Vue.extend(chunk.default)

            // Собираем обект пропсов
            let propsData = {}
            if (this.asyncComponent.data.attrs) {
              propsData = Object.entries(this.asyncComponent.data.attrs)
              propsData = propsData.map(([key, value]) => {
                const upperSpl = key.split('-').map((item, index) => {
                  if (index > 0) {
                    return item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()
                  }
                  return item
                }).join('')
                return [upperSpl, value]
              })

              propsData = Object.fromEntries(propsData)
            }

            // Создаем компонент
            const component = new Component({
              propsData
            })

            // Пробрасываем слоты
            if (this.asyncComponent.data.scopedSlots) {
              for (const [name, render] of Object.entries(this.asyncComponent.data.scopedSlots)) {
                if (typeof render === 'function') {
                  component.$slots[name] = render()
                }
              }
            }

            component.$slots.default = this.asyncComponent.componentOptions.children

            // Вешаем события
            if (this.asyncComponent.componentOptions.listeners) {
              for (const [event, handler] of Object.entries(this.asyncComponent.componentOptions.listeners)) {
                component.$on(event, handler)
              }
            }

            // Собираем html
            component.$mount()

            // Вешаем css классы
            component.$el.classList.add(...this.asyncComponent.data.staticClass.split(' '))

            // Переносим data аттрибуты
            for (const attr in this.$el.dataset) {
              component.$el.dataset[attr] = ''
            }

            // Добавляем компонент в DOM вместо якоря
            this.$el.outerHTML = component.$el.outerHTML

            this.$emit('make', component)
          })
          .catch(e => console.error(e.message))
      }
    }

    const options = {
      threshold: this.threshold,
      rootMargin: this.rootMargin
    }

    this.observer = new IntersectionObserver(handler, options)

    // Нужно подождать следующего тика для того, чтобы дочерний элемент мог отрисоваться.
    this.$nextTick(() => {
      this.observer.observe(this.$el)
    })
  }
}
</script>
