// Marks the current section in the table of contents.
const links = [...document.querySelectorAll('.doc-toc a')];
const toc = document.getElementById('toc');

function setActive(id) {
  links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
}

const observer = new IntersectionObserver((entries) => {
  entries.filter((e) => e.isIntersecting).forEach((e) => setActive(e.target.id));
}, { rootMargin: '-15% 0px -75% 0px' });

links.forEach((a) => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) observer.observe(section);
});

// On a phone the contents start closed, and close again after choosing a section.
const phone = window.matchMedia('(max-width: 900px)');
if (phone.matches) toc.open = false;
links.forEach((a) => a.addEventListener('click', () => {
  if (phone.matches) toc.open = false;
}));
