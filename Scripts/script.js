document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('three-canvas');
  const scrollDownElement = document.getElementById('scroll-down');
  const menuButton = document.querySelector(".menu-button");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const titles = document.querySelectorAll(".title");
  const main = document.querySelector("main");

  const loadingScreen = document.getElementById("loading-screen");

  window.addEventListener("load", () => {
    if (loadingScreen) {
      loadingScreen.style.transition = "opacity 0.5s ease";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  });

  titles.forEach((title, index) => {
    const menuItem = document.createElement("a");
    menuItem.href = `#title-${index}`;
    menuItem.textContent = title.textContent;
    dropdownMenu.appendChild(menuItem);
    title.id = `title-${index}`;
  });

  menuButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  dropdownMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const targetId = e.target.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      canvas.style.opacity = '0';
      canvas.dataset.forcecamera = true;

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      dropdownMenu.classList.add("hidden");
    }
  });

  let lastTouchY = 0;

  function handleScroll(yOffsetChange) {
    const canvasOpacity = parseFloat(window.getComputedStyle(canvas).opacity);
    if (window.scrollY > 8500) {
      scrollDownElement.style.display = 'none';
    } else {
      scrollDownElement.style.display = 'block';
    }

    if (canvasOpacity > 0) {
      return true; // Prevent default scrolling
    } else if ((window.scrollY <= 0 || window.scrollY === undefined) && yOffsetChange < 0) {
      canvas.style.opacity = '0.01';
      canvas.style.zIndex = '1';
      return true;
    }

    return false; // Allow default scrolling
  }

  main.addEventListener('touchstart', (event) => {
    lastTouchY = event.touches[0].clientY;
  });

  main.addEventListener('touchmove', (event) => {
    const touchY = event.touches[0].clientY;
    const yOffsetChange = lastTouchY - touchY;
    lastTouchY = touchY;
    handleScroll(yOffsetChange)
  });

  window.addEventListener('wheel', (event) => {
    if (handleScroll(event.deltaY)) {
      event.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
});
