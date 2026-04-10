const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const pagination = carousel.querySelector("[data-carousel-pagination]");

  if (!track || !prevButton || !nextButton || !pagination) {
    return;
  }

  const slides = Array.from(track.children);

  if (slides.length === 0) {
    return;
  }

  const getStep = () => {
    const firstSlide = slides[0];
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || "0");

    return firstSlide.getBoundingClientRect().width + gap;
  };

  const getSlidesPerPage = () => {
    if (window.innerWidth < 768) {
      return 1;
    }

    return 4;
  };

  const getMaxIndex = () => {
    return Math.max(0, slides.length - getSlidesPerPage());
  };

  const getActiveIndex = () => {
    const step = getStep();

    if (step === 0) {
      return 0;
    }

    return Math.round(track.scrollLeft / step);
  };

  const getPageCount = () => {
    return Math.ceil(slides.length / getSlidesPerPage());
  };

  const getActivePage = () => {
    return Math.round(getActiveIndex() / getSlidesPerPage());
  };

  const scrollToSlide = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, getMaxIndex()));

    track.scrollTo({
      left: clampedIndex * getStep(),
      behavior: "smooth"
    });
  };

  const renderPagination = () => {
    pagination.innerHTML = "";

    return Array.from({ length: getPageCount() }, (_, index) => {
      const bullet = document.createElement("button");
      bullet.type = "button";
      bullet.className = "swiper-pagination-bullet";
      bullet.setAttribute("aria-label", `Go to page ${index + 1}`);
      bullet.addEventListener("click", () => {
        scrollToSlide(index * getSlidesPerPage());
      });
      pagination.appendChild(bullet);
      return bullet;
    });
  };

  let bullets = renderPagination();

  const updateState = () => {
    const activeIndex = getActiveIndex();
    const activePage = Math.min(getActivePage(), bullets.length - 1);

    bullets.forEach((bullet, index) => {
      if (index === activePage) {
        bullet.setAttribute("aria-current", "true");
      } else {
        bullet.removeAttribute("aria-current");
      }
    });

    prevButton.disabled = activeIndex <= 0;
    nextButton.disabled = activeIndex >= getMaxIndex();
  };

  prevButton.addEventListener("click", () => {
    scrollToSlide(getActiveIndex() - getSlidesPerPage());
  });

  nextButton.addEventListener("click", () => {
    scrollToSlide(getActiveIndex() + getSlidesPerPage());
  });

  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateState);
  });

  window.addEventListener("resize", () => {
    const currentPage = getActivePage();
    bullets = renderPagination();
    scrollToSlide(currentPage * getSlidesPerPage());
    window.requestAnimationFrame(updateState);
  });

  updateState();
});
