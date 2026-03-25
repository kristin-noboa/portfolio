// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu on click
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 80) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = current;
});

// Active nav link highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('text-pink-400', link.getAttribute('href') === '#' + entry.target.id);
        link.classList.toggle('text-gray-600', link.getAttribute('href') !== '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(section => observer.observe(section));

// Portfolio filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update button styles
    filterBtns.forEach(b => {
      b.classList.remove('bg-pink-400', 'text-white');
      b.classList.add('bg-white', 'text-gray-600');
    });
    btn.classList.remove('bg-white', 'text-gray-600');
    btn.classList.add('bg-pink-400', 'text-white');

    // Show/hide items
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.discipline === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Portfolio lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxText = document.getElementById('lightbox-text');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const card = item.querySelector('.relative');
    const title = item.querySelector('h3').textContent;
    const desc = item.querySelector('.absolute p')?.textContent || '';
    // Clone the card visual (without the hover overlay) into the lightbox
    lightboxImage.innerHTML = '';
    const clone = card.cloneNode(true);
    // Remove hover overlay from clone
    const overlay = clone.querySelector('.absolute');
    if (overlay) overlay.remove();
    // Make it fill the lightbox image area
    clone.classList.remove('aspect-[4/3]');
    clone.className = 'w-full h-full flex items-center justify-center text-2xl font-medium ' +
      [...card.classList].filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ');
    clone.style.minHeight = '400px';
    lightboxImage.appendChild(clone);
    lightboxTitle.textContent = title;
    lightboxText.textContent = desc;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox();
});

// Contact form — submit to Formspree without redirect
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('form-status');
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      status.textContent = 'Thanks! Your message has been sent.';
      status.style.color = '#16a34a';
      status.classList.remove('hidden');
      form.reset();
      setTimeout(() => status.classList.add('hidden'), 4000);
    } else {
      status.textContent = 'Oops! Something went wrong. Please try again.';
      status.style.color = '#dc2626';
      status.classList.remove('hidden');
    }
  } catch {
    status.textContent = 'Oops! Something went wrong. Please try again.';
    status.style.color = '#dc2626';
    status.classList.remove('hidden');
  }
});

