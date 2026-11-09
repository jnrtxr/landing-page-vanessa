document.getElementById('ano').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

/* Hand-rolled smooth scroll for in-page links, so the motion always shows regardless of OS/browser animation settings. */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let scrollAnimFrame = null;

function cancelSmoothScroll() {
  if (scrollAnimFrame) {
    cancelAnimationFrame(scrollAnimFrame);
    scrollAnimFrame = null;
  }
}

function smoothScrollTo(targetY, duration = 700) {
  cancelSmoothScroll();
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) {
    window.scrollTo(0, targetY);
    return;
  }
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    scrollAnimFrame = progress < 1 ? requestAnimationFrame(step) : null;
  }
  scrollAnimFrame = requestAnimationFrame(step);
}

/* If the visitor scrolls by hand mid-animation, stop overriding their input. */
['wheel', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, cancelSmoothScroll, { passive: true });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (id === 'topo') {
      e.preventDefault();
      smoothScrollTo(0);
      history.pushState(null, '', '#topo');
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - 92;
    smoothScrollTo(targetY);
    history.pushState(null, '', `#${id}`);
  });
});

/* Scroll-reveal: sections and list items fade/rise into place as they enter the viewport. */
document.documentElement.classList.add('js-ready');

const revealSelectors = ['.sobre__text', '.pull-quote', '.banner__inner', '.section__head', '.contato__info', '.contato__map'];
revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

const staggerSelectors = ['.index-list', '.steps', '.principles', '.videos__grid'];
staggerSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    [...group.children].forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
    });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
