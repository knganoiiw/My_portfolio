const nav = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('header[id], section[id]');
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.18,
});

reveals.forEach(el => revealObserver.observe(el));

function updateNavbarScroll() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  updateActiveSection();
}

function updateActiveSection() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLink) {
        navLink.classList.add('active');
      }
    }
  });
}

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

window.addEventListener('scroll', updateNavbarScroll);
window.addEventListener('load', updateNavbarScroll);
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* Project preview modal */
const modal = document.getElementById('project-modal');
const backdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalDownload = document.getElementById('modal-download');
const docName = document.getElementById('doc-name');
const viewerFrame = document.getElementById('viewer-frame');
const viewerMock = document.getElementById('viewer-mock');
const docFrame = document.getElementById('doc-frame');

const isPdfFile = (file) => file.toLowerCase().endsWith('.pdf');

const openProjectModal = ({ title, file }) => {
  const encodedFile = encodeURI(file);
  const pdfPreview = isPdfFile(file);

  modalTitle.textContent = title;
  docName.textContent = title;
  modalDownload.href = encodedFile;
  modalDownload.setAttribute('download', title);

  if (pdfPreview) {
    viewerFrame.classList.add('active');
    viewerMock.classList.remove('active');
    viewerFrame.setAttribute('aria-hidden', 'false');
    viewerMock.setAttribute('aria-hidden', 'true');
    docFrame.src = encodedFile;
  } else {
    viewerFrame.classList.remove('active');
    viewerMock.classList.add('active');
    viewerFrame.setAttribute('aria-hidden', 'true');
    viewerMock.setAttribute('aria-hidden', 'false');
    docFrame.src = '';
  }

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('modal-open');
  modalClose.focus();
};

const closeProjectModal = () => {
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.classList.remove('modal-open');
  docFrame.src = '';
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) {
    closeProjectModal();
  }
  if (event.key === 'Tab' && modal.classList.contains('open')) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

modalClose.addEventListener('click', closeProjectModal);
backdrop.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', handleKeyDown);

document.querySelectorAll('.btn-view-report').forEach((button) => {
  button.addEventListener('click', () => {
    const file = button.dataset.file;
    const title = button.dataset.title || file.split('/').pop();
    openProjectModal({ title, file });
  });
});
