
const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const themeToggle = document.querySelector('.theme-toggle');
const scrollTopBtn = document.querySelector('.scroll-top');
const year = document.getElementById('year');
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

function syncThemeButton() {
  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.firstElementChild.textContent = isLight ? '☼' : '◐';
}
syncThemeButton();

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (next === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeButton();
});

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 840px)').matches) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0.1 });

sections.forEach(section => observer.observe(section));

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 420);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// subtle 3D tilt for hero card
const heroCard = document.querySelector('.hero-card');
if (heroCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const maxTilt = 8;
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * maxTilt;
    const ry = (x - 0.5) * maxTilt;
    heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}
