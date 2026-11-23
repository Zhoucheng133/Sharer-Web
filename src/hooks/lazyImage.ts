import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

// Defers setting an image's src until its element is close to the viewport.
// Works together with the native loading="lazy" attribute on the <img>.
export function useLazyImage(url: Ref<string>) {
  const el = ref<HTMLElement | null>(null);
  const shouldLoad = ref(false);
  const loaded = ref(false);
  const failed = ref(false);
  let observer: IntersectionObserver | undefined;

  function observe() {
    observer?.disconnect();
    observer = undefined;
    loaded.value = false;
    failed.value = false;

    // Nothing to load (e.g. non-image files), or no IO support: load right away.
    if (!url.value || typeof IntersectionObserver === 'undefined' || !el.value) {
      shouldLoad.value = true;
      return;
    }

    shouldLoad.value = false;
    observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      shouldLoad.value = true;
      observer?.disconnect();
      observer = undefined;
    }, { rootMargin: '300px 0px' });
    observer.observe(el.value);
  }

  onMounted(observe);
  watch(url, observe);
  onUnmounted(() => observer?.disconnect());

  return { el, shouldLoad, loaded, failed };
}
