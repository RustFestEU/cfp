export default {
  updated(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight+4)+'px';
  }
}