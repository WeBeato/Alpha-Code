let menu = document.querySelector('.menu');
let menuToggle = document.querySelector('.menu__toggle');
let menuItems = document.querySelectorAll('.menu__item');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('menu--active');
  menuToggle.classList.toggle('menu__toggle--active');
})

menuItems.forEach(menuItem => menuItem.addEventListener('click', function () {
  menuItems.forEach(i => i.classList.remove('menu__item--active'))
  this.classList.add('menu__item--active')
}))


// dashboard

const toggleBtn = document.querySelector(".sidebar-btn");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const sidebarItem = document.querySelectorAll('.sidebar-item');

let isOpen = true;

toggleBtn.addEventListener("click", () => {
  isOpen = !isOpen;

  sidebar.classList.toggle("sidebar--show");
  content.classList.toggle("content--open");

  toggleBtn.innerHTML = isOpen ? "⇤" : "⇥";
});

sidebarItem.forEach(btn => {
  btn.addEventListener("click", () => {
    sidebar.classList.remove("sidebar--show");
    content.classList.remove("content--open");
    toggleBtn.innerHTML = "⇤";
  })
});




// contents

const contentDiv = document.querySelector('.content');

function loadpage(pageName) {
  contentDiv.classList.add('fade-out');

  setTimeout(() => {
    fetch(`pages/${pageName}.html`)
      .then(res => res.text())
      .then(html => {
        contentDiv.innerHTML = html;
        contentDiv.classList.remove('fade-out');
        contentDiv.classList.add('fade-in');

        // if about-page for skills and btn and slider
        if (pageName === 'about') {
          setTimeout(() => {
            animateSkills();
            initAboutPage();
          }, 100);
        }
        if (pageName === 'resume') {
          setTimeout(() => {
            initResumeSlider();
          }, 100);
        }
        if (pageName === 'home') {
          setTimeout(() => {
            initHomePage();
          }, 100);
        }
        setTimeout(() => {
          contentDiv.classList.remove('fade-in');
        }, 300);
      });
  }, 300);
}

document.querySelectorAll('.menu__item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    loadpage(page);

    document.querySelectorAll('.menu__item').forEach(el => el.classList.remove('menu__item--active'));
    item.classList.add('menu__item--active');
  });
});


// btns page home
function initHomePage() {
  document.querySelectorAll('.home-page__link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const page = btn.dataset.page;
      loadpage(page);
      document.querySelectorAll('.menu__item').forEach(el => el.classList.remove('menu__item--active'));
      const matchingMenuItem = document.querySelector(`.menu__item[data-page="${page}"]`);
      if (matchingMenuItem) {
        matchingMenuItem.classList.add('menu__item--active');
      }
    });
  });
}


// about transition

function animateSkills() {
  const fills = document.querySelectorAll(".about__progress-fill");
  fills.forEach((fill, index) => {
    setTimeout(() => {
      const percent = fill.dataset.percent;
      fill.style.width = percent + "%";
    }, index * 150);
  });
}
// btn discription about page
function initAboutPage() {
  const button = document.querySelector(".about__button");
  const moreContent = document.querySelector(".about__more");

  if (!button || !moreContent) return;

  button.addEventListener("click", () => {
    const paragraphs = moreContent.querySelectorAll("p");
    let current = 0;

    function typeParagraph(index) {
      const p = paragraphs[index];
      const text = p.innerText;
      p.innerHTML = "";
      p.style.display = "block";

      let charIndex = 0;

      const typer = setInterval(() => {
        if (charIndex < text.length) {
          const char = text.charAt(charIndex);
          p.innerHTML += char === " " ? "&nbsp;" : char;
          charIndex++;
        } else {
          clearInterval(typer);
          current++;
          if (current < paragraphs.length) {
            setTimeout(() => typeParagraph(current), 500);
          }
        }
      }, 20);
    }

    button.style.display = "none";
    moreContent.classList.remove("hidden");
    typeParagraph(current);
  });
}

// slider page resume

function initResumeSlider() {
  const slides = document.querySelectorAll('.resume__slide');
  const dots = document.querySelectorAll('.resume__dot');
  let currentIndex = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('resume__slide--active', i === index);
      dots[i].classList.toggle('resume__dot--active', i === index);
    });
    currentIndex = index;
  }

  function startSlider() {
    interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showSlide(Number(dot.dataset.index));
      startSlider();
    });
  });

  showSlide(0);
  startSlider();
}

// dash-btn
async function loadside(pageName) {
  const content = document.querySelector('.content');
  content.classList.remove('show');
  setTimeout(async () => {
    try {
      const res = await fetch(`pages/${pageName}.html`);
      if (!res.ok) throw new Error('Page not found');
      const html = await res.text();
      content.innerHTML = html;
      content.setAttribute('data-page', pageName);
      content.classList.add('show');
    } catch (err) {
      content.innerHTML = `<p style="color:red;">مشکلی در بارگذاری صفحه پیش آمد.</p>`;
      content.classList.add('show');
    }
    if (pageName === 'login') initLoginScripts();
  }, 300);
}
document.querySelectorAll('.sidebar-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.getAttribute('data-page');
    loadside(page);
  });
});

// login-dash

function initLoginScripts() {
  const eyes = document.querySelectorAll(".eye");
  const pupils = document.querySelectorAll(".pupil");
  const passwordInputs = document.querySelectorAll(".password-input");

  document.addEventListener("mousemove", (e) => {
    const bounds = 20;
    eyes.forEach((eye, i) => {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angleX = Math.max(Math.min(dx / 10, bounds), -bounds);
      const angleY = Math.max(Math.min(dy / 10, bounds), -bounds);
      pupils[i].style.left = `${22 + angleX}px`;
      pupils[i].style.top = `${8 + angleY}px`;
    });
  });

  passwordInputs.forEach(input => {
    input.addEventListener("focus", () => {
      eyes.forEach(eye => eye.classList.add("closed"));
    });
    input.addEventListener("blur", () => {
      eyes.forEach(eye => eye.classList.remove("closed"));
    });
  });

  document.querySelectorAll(".form-links span").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
      if (link.classList.contains("to-signup")) {
        document.querySelector(".form-signup").classList.add("active");
      } else if (link.classList.contains("to-login")) {
        document.querySelector(".form-login").classList.add("active");
      } else if (link.classList.contains("to-forgot")) {
        document.querySelector(".form-forgot").classList.add("active");
      }
    });
  });
}
