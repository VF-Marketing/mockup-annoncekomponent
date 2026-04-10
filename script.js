const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const pagination = carousel.querySelector("[data-carousel-pagination]");
  const slides = Array.from(track.children);

  if (!track || slides.length === 0) {
    return;
  }

  const getStep = () => {
    const firstSlide = slides[0];
    const slideStyles = window.getComputedStyle(track);
    const gap = parseFloat(slideStyles.columnGap || slideStyles.gap || "0");

    return firstSlide.getBoundingClientRect().width + gap;
  };

  const scrollToSlide = (index) => {
    const maxIndex = slides.length - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));

    track.scrollTo({
      left: clampedIndex * getStep(),
      behavior: "smooth"
    });
  };

  const getActiveIndex = () => {
    const step = getStep();

    if (step === 0) {
      return 0;
    }

    return Math.round(track.scrollLeft / step);
  };

  const bullets = slides.map((_, index) => {
    const bullet = document.createElement("button");
    bullet.type = "button";
    bullet.className = "swiper-pagination-bullet";
    bullet.setAttribute("aria-label", `Gå til rejse ${index + 1}`);
    bullet.addEventListener("click", () => scrollToSlide(index));
    pagination.appendChild(bullet);
    return bullet;
  });

  const updateState = () => {
    const activeIndex = getActiveIndex();

    bullets.forEach((bullet, index) => {
      if (index === activeIndex) {
        bullet.setAttribute("aria-current", "true");
      } else {
        bullet.removeAttribute("aria-current");
      }
    });

    prevButton.disabled = activeIndex <= 0;
    nextButton.disabled = activeIndex >= slides.length - 1;
  };

  prevButton.addEventListener("click", () => {
    scrollToSlide(getActiveIndex() - 1);
  });

  nextButton.addEventListener("click", () => {
    scrollToSlide(getActiveIndex() + 1);
  });

  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateState);
  });

  window.addEventListener("resize", updateState);
  updateState();
});
