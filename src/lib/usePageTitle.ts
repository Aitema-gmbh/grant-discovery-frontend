import { watch } from 'vue'
import type { Ref } from 'vue'

const BASE_TITLE = 'Grants Bridge Ukraine'

export function usePageTitle(title: string | Ref<string>) {
  if (typeof title === 'string') {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE
  } else {
    // Reactive title
    watch(title, (val) => {
      document.title = val ? `${val} | ${BASE_TITLE}` : BASE_TITLE
    }, { immediate: true })
  }
}
