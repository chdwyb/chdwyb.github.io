(() => {
  const navigation = [...document.querySelectorAll('.site-nav a')];
  const sections = navigation.map(link => document.querySelector(link.hash));

  function activate(id) {
    navigation.forEach(link => {
      if (link.hash === `#${id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  navigation.forEach(link => {
    link.addEventListener('click', () => activate(link.hash.slice(1)));
  });

  function syncFromHash() {
    const match = navigation.find(link => link.hash === window.location.hash);
    if (match) activate(match.hash.slice(1));
    else if (!window.location.hash) activate('biography');
  }
  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
  if (!('IntersectionObserver' in window)) return;

  const visibleSections = new Set();
  const navigationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target.id);
      else visibleSections.delete(entry.target.id);
    });
    const current = sections.find(section => visibleSections.has(section.id));
    if (current) activate(current.id);
  }, { rootMargin: '-15% 0px -55% 0px' });
  sections.forEach(section => navigationObserver.observe(section));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal');
      entry.target.dataset.visible = 'true';
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section:not(.intro-section)').forEach(section => {
    revealObserver.observe(section);
  });
})();
