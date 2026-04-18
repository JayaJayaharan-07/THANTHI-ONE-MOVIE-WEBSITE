// ── Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {

  // ── SLIDER ──────────────────────────────────────────────
  const items      = document.querySelectorAll('.slider .list .item');
  const thumbnails = document.querySelectorAll('.thumbnail .item');
  const nextBtn    = document.getElementById('next');
  const prevBtn    = document.getElementById('prev');

  // Guard: if slider elements don't exist, stop
  if (!items.length || !nextBtn || !prevBtn) return;

  let itemActive      = 0;
  let countItem       = items.length;
  let refreshInterval = null;

  // Start auto-play
  startAutoPlay();

  // Next button
  nextBtn.addEventListener('click', function () {
    itemActive = (itemActive + 1) % countItem;
    showSlider();
  });

  // Prev button
  prevBtn.addEventListener('click', function () {
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
  });

  // Thumbnail click
  thumbnails.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      itemActive = index;
      showSlider();
    });
  });

  function showSlider() {
    // Remove active from current
    const oldItem  = document.querySelector('.slider .list .item.active');
    const oldThumb = document.querySelector('.thumbnail .item.active');
    if (oldItem)  oldItem.classList.remove('active');
    if (oldThumb) oldThumb.classList.remove('active');

    // Add active to new
    items[itemActive].classList.add('active');
    if (thumbnails[itemActive]) thumbnails[itemActive].classList.add('active');

    // Scroll thumbnail into view
    scrollThumbnailIntoView();

    // Reset auto-play timer
    clearInterval(refreshInterval);
    startAutoPlay();
  }

  function startAutoPlay() {
    refreshInterval = setInterval(function () {
      itemActive = (itemActive + 1) % countItem;
      showSlider();
    }, 5000);
  }

  function scrollThumbnailIntoView() {
    const activeThumb = document.querySelector('.thumbnail .item.active');
    if (!activeThumb) return;
    const rect = activeThumb.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }
  }

  // ── NAVBAR ──────────────────────────────────────────────
  const sideNav  = document.getElementById('side-navbar');
  const overlay  = document.getElementById('nav-overlay');

  window.showNavbar = function () {
    if (!sideNav || !overlay) return;
    sideNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeNavbar = function () {
    if (!sideNav || !overlay) return;
    sideNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close navbar on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNavbar();
  });

  // ── HEADER SCROLL EFFECT ─────────────────────────────────
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── TOUCH SWIPE SUPPORT FOR SLIDER ───────────────────────
  const sliderEl = document.querySelector('.slider');
  if (sliderEl) {
    let touchStartX = 0;
    let touchEndX   = 0;

    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swiped left → next
          itemActive = (itemActive + 1) % countItem;
        } else {
          // Swiped right → prev
          itemActive = (itemActive - 1 + countItem) % countItem;
        }
        showSlider();
      }
    }, { passive: true });
  }

}); // end DOMContentLoaded
