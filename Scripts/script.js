document.addEventListener('DOMContentLoaded', async () => {
  const loadingScreen = document.getElementById("loading-screen");
  const mainContent = document.querySelector(".main-content");
  let isLoading = false;

  // Define routes first
  const routes = {
    '.home-link': '../Views/Home/home.html',
    '.projects-link': '../Views/Projects/projects.html',
    '.services-link': '../Views/Services/services.html',
    '.devblog-link': '../Views/DevBlog/devBlog.html',
    '.about-link': '../Views/About/about.html',
    '.contact-link': '../Views/Contact/contact.html',
    '.contact-button': '../Views/Contact/contact.html',
    '.beegest-button': '../Views/About/beegest.html',
    '.read-more-currivand-dev': '../Views/About/BlogPost/currivand-dev.html',
    '.read-more-cnn': '../Views/About/BlogPost/cnn.html'
  };

  // Function to update selected state
  function updateSelectedState(clickedLink) {
    // Remove selected class from all links
    document.querySelectorAll('.nav ul li a').forEach(link => {
      link.classList.remove('selected');
    });
    
    // Add selected class to clicked link
    if (clickedLink) {
      // Find all links with the same class as the clicked link
      const linkClass = Array.from(clickedLink.classList)
        .find(className => className.endsWith('-link'));
      if (linkClass) {
        document.querySelectorAll('.' + linkClass).forEach(link => {
          link.classList.add('selected');
        });
      }
    }
  }

  // Attach initial event listeners
  function attachRouteListeners() {
    Object.entries(routes).forEach(([selector, path]) => {
      document.querySelectorAll(selector).forEach(link => {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          
          if (isLoading) return;
          if(link.classList.contains('contact-button', 'contact-link')){
            const service = link.dataset.service;
            let message = 'Bonjour,\n\nJe suis intéressé(e) par ';
            
            switch(service){
              case 'site-web':
                message += 'votre service création de site web.\n\nJ\'aimerais un site vitrine pour ...\n\nCordialement,';
                break;
              case 'application-web':
                message += 'votre service d\'application web.\n\nJ\'aimerais une application capable de ...\n\nCordialement,';
                break;
              case 'consulting':
                message += 'votre service de consulting.\n\nJ\'ai besoin de vous pour ...\n\nCordialement,';
                break;
              default:
                message += 'vos services.\n\nVoici mes besoins ...\n\nCordialement,';
            }
            loadContent(path, e.currentTarget, message);
          } else {
            loadContent(path, e.currentTarget, null);
          }
        });
      });
    });
  }

  // Loading screen handler
  window.addEventListener("load", () => {
    if (loadingScreen) {
      loadingScreen.style.transition = "opacity 0.5s ease";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 400);
    }
  });

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

  // Function to load content with animation
  async function loadContent(url, clickedLink, message) {
    if (isLoading) return;
    isLoading = true;
    
    document.querySelectorAll('.nav ul li a').forEach(link => {
      link.style.pointerEvents = 'none';
      link.style.opacity = '0.5';
    });

    try {
      mainContent.scrollTo(0, 0);
      
      // Update selected state
      updateSelectedState(clickedLink);

      mainContent.style.opacity = '0';
      const response = await fetch(url);
      const data = await response.text();

      await new Promise(resolve => setTimeout(resolve, 200));

      mainContent.innerHTML = data;
      mainContent.style.opacity = '1';

      const messageField = document.getElementById('message');
      if (messageField) {
        if (messageField) {
          messageField.value = message;
        }
      }

      const elements = mainContent.querySelectorAll('.stat, .header');

      elements.forEach((element, index) => {
        const direction = index % 2 === 0 ? -20 : 20;
        element.style.opacity = '0';
        element.style.transform = `translateX(${direction}px)`;
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      // Animate elements one by one
      for (let i = 0; i < elements.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        elements[i].style.opacity = '1';
        elements[i].style.transform = 'translateX(0)';
      }

      const principal = mainContent.querySelector('.principal');
      if (principal) {
        await new Promise(resolve => setTimeout(resolve, 150));
        principal.style.background = 'radial-gradient(circle at center, rgb(253, 216, 179) 10%, transparent 50%)';
        principal.style.transition = 'background 0.5s ease';
      }

      attachRouteListeners();

      const contactForm = mainContent.querySelector('#contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
          e.preventDefault();
          try {
            const templateParams = {
              from_name: document.getElementById('name').value,
              message: document.getElementById('message').value,
              from_email: document.getElementById('email').value,
            };

            const response = await emailjs.send("service_3obsqjc","template_fcibusq",templateParams
            );

            if (response.status === 200) {
              alert('Message envoyé avec succès!');
              contactForm.reset();
            }
          } catch (error) {
            console.error('EmailJS Error:', error);
            alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
          }
        });
      }

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      document.querySelectorAll('.nav ul li a').forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
      });
      isLoading = false;
    }
  }

  // Add transition styles to main content
  mainContent.style.transition = 'opacity 0.2s ease';

  // Load default content from home.html and set initial selected state
  await loadContent('../Views/Home/home.html', document.querySelector('.home-link'));

  attachRouteListeners();
});
