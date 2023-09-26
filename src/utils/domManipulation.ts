export function hasParentWithClass(
  element: HTMLElement,
  className: string
): boolean {
  let current = element;
  while (current.parentElement) {
    current = current.parentElement;
    if (current.classList.contains(className)) {
      return true;
    }
  }
  return false;
}
