import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

function handleOnline() {
  isOnline.value = true
}

function handleOffline() {
  isOnline.value = false
}

let listenersAttached = false

export function useNetworkStatus() {
  onMounted(() => {
    if (!listenersAttached) {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      listenersAttached = true
    }
    isOnline.value = navigator.onLine
  })

  onUnmounted(() => {
    // Keep listeners alive — they're shared across components
  })

  return { isOnline }
}
