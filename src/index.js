import AsyncLoading from '@/components/AsyncLoading'
import AsyncComponent from '@/components/AsyncComponent'

const Components = [
  AsyncLoading,
  AsyncComponent
]

const install = function (Vue, opts = {}) {
  Components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  AsyncLoading,
  AsyncComponent
}
