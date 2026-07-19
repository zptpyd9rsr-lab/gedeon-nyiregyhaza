// L+Z Vendégházak — közös interakciók: nav, lightbox, scroll-reveal

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Lightbox gallery */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentGroup = [];
    let currentIndex = 0;

    function showAt(index) {
      if (!currentGroup.length) return;
      currentIndex = (index + currentGroup.length) % currentGroup.length;
      const target = currentGroup[currentIndex];
      lbImg.src = target.getAttribute('href') || target.querySelector('img').src;
      lbImg.alt = target.querySelector('img')?.alt || '';
    }

    function openLightbox(group, index) {
      currentGroup = group;
      showAt(index);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-lightbox]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const groupName = link.getAttribute('data-lightbox');
        const group = Array.from(document.querySelectorAll(`[data-lightbox="${groupName}"]`));
        openLightbox(group, group.indexOf(link));
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => showAt(currentIndex + 1));
    prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showAt(currentIndex + 1);
      if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
    });
  }

  /* Only allow one <details class="unit"> open at a time within its parent complex (optional nicety) */
  document.querySelectorAll('.unit').forEach(unit => {
    unit.addEventListener('toggle', () => {
      if (unit.open) {
        unit.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
