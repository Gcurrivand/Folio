document.addEventListener('DOMContentLoaded', async () => {
  const loadingScreen = document.getElementById("loading-screen");
  const mainContent = document.querySelector(".main-content");
    // Load default content from home.html
    try {
      const response = await fetch('../Views/home.html');
      const data = await response.text();
      mainContent.innerHTML = data;
    } catch (error) {
      console.error('Error loading default home.html:', error);
    }

  window.addEventListener("load", () => {
    if (loadingScreen) {
      loadingScreen.style.transition = "opacity 0.5s ease";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  });

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

  /*ROUTING*/
  const homeLinks = document.querySelectorAll(".home-link");
  homeLinks.forEach(homeLink => {
    homeLink.addEventListener('click', async () => {
      try {
        const response = await fetch('../Views/home.html');
        const data = await response.text();
        mainContent.innerHTML = data;
      } catch (error) {
        console.error('Error loading home.html:', error);
      }
    });
  });

  const projectsLinks = document.querySelectorAll(".projects-link");
  projectsLinks.forEach(projectsLink => {
    projectsLink.addEventListener('click', async () => {
      try {
        const response = await fetch('../Views/projects.html');
        const data = await response.text();
        mainContent.innerHTML = data;
      } catch (error) {
        console.error('Error loading home.html:', error);
      }
    });
  });


});
