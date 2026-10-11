// Retain the page API: content is immediately visible and cards stay still.
export const Animations = {
  initScrollReveal() {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("visible"));
  },
  setupTilt() {},
};
export default Animations;
