export const scrollTo = (selector: string) => {
  const $el = document.querySelector(selector)
  if ($el) $el.scrollIntoView({ behavior: 'smooth' })
}
