document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('three-canvas');
  const scrollDownElement = document.getElementById('scroll-down');

  const menuButton = document.querySelector(".menu-button");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Get all titles from the page
  const titles = document.querySelectorAll(".title");

  // Populate the dropdown menu
  titles.forEach((title, index) => {
    const titleText = title.textContent;
    const menuItem = document.createElement("a");
    menuItem.href = `#title-${index}`; // Add unique ID for scrolling
    menuItem.textContent = titleText;
    dropdownMenu.appendChild(menuItem);

    // Add an ID to each title for scrolling
    title.id = `title-${index}`;
  });

  // Show/hide the dropdown menu on button click
  menuButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  // Smooth scrolling
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
      // Hide the dropdown menu after selection
      dropdownMenu.classList.add("hidden");
    }
  });

  // Add a listener for the wheel event
  window.addEventListener('wheel', (event) => {
      const canvasOpacity = parseFloat(window.getComputedStyle(canvas).opacity);
      if(window.scrollY > 8500){
        scrollDownElement.style.display = 'none';
        scrollDownElement.style.zIndex = 0;
      }else{
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
