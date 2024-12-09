document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('three-canvas');
  const scrollDownElement = document.getElementById('scroll-down');
  const menuButton = document.querySelector(".menu-button");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const titles = document.querySelectorAll(".title");

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

  window.addEventListener('wheel', (event) => {
    const canvasOpacity = parseFloat(window.getComputedStyle(canvas).opacity);
    if (window.scrollY > 8500) {
      scrollDownElement.style.display = 'none';
      scrollDownElement.style.zIndex = 0;
    } else {
      scrollDownElement.style.display = 'block';
      scrollDownElement.style.zIndex = 2;
    }

    if (canvasOpacity > 0) {
      event.preventDefault();
    } else {
      if ((window.scrollY <= 0 || window.scrollY === undefined) && event.deltaY < 0) {
        canvas.style.opacity = '0.01';
      }
    }
  }, { passive: false });

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
});
