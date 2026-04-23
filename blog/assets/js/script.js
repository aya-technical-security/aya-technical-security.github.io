document.getElementById('year').textContent = new Date().getFullYear();

/* =========================
   Music Control
========================= */
const musicToggle = document.getElementById('musicToggle');
const bgm = document.getElementById('bgm');

const STORAGE_KEY = 'aya_blog_music_playing';
const TIME_KEY = 'aya_blog_music_time';

if (musicToggle && bgm) {
  const savedPlaying = localStorage.getItem(STORAGE_KEY) === 'true';
  const savedTime = parseFloat(localStorage.getItem(TIME_KEY) || '0');

  if (!Number.isNaN(savedTime)) {
    bgm.currentTime = savedTime;
  }

  const syncButton = (playing) => {
    if (playing) {
      musicToggle.textContent = '⏸ Music';
      musicToggle.classList.add('is-playing');
      musicToggle.setAttribute('aria-pressed', 'true');
    } else {
      musicToggle.textContent = '♫ Music';
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  };

  syncButton(false);

  if (savedPlaying) {
    bgm.play()
      .then(() => syncButton(true))
      .catch(() => syncButton(false));
  }

  musicToggle.addEventListener('click', async () => {
    if (bgm.paused) {
      try {
        await bgm.play();
        localStorage.setItem(STORAGE_KEY, 'true');
        syncButton(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      bgm.pause();
      localStorage.setItem(STORAGE_KEY, 'false');
      localStorage.setItem(TIME_KEY, String(bgm.currentTime));
      syncButton(false);
    }
  });

  bgm.addEventListener('timeupdate', () => {
    localStorage.setItem(TIME_KEY, String(bgm.currentTime));
  });

  window.addEventListener('beforeunload', () => {
    localStorage.setItem(TIME_KEY, String(bgm.currentTime));
    localStorage.setItem(STORAGE_KEY, String(!bgm.paused));
  });
}

/* =========================
   Modal Window
========================= */
const openButtons = document.querySelectorAll('.open-modal');
const modals = document.querySelectorAll('.modal');

const closeModal = (modal) => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

openButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-modal]');
    const targetId = card?.dataset.modal;
    const modal = document.getElementById(targetId);

    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
});

modals.forEach((modal) => {
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('[data-close="true"]');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => closeModal(modal));
  }
});

/* ESCキーで閉じる */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modals.forEach((modal) => {
      if (modal.classList.contains('is-open')) {
        closeModal(modal);
      }
    });
  }
});
