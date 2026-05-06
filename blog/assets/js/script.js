(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     Music
  ========================= */
  const musicToggle = document.getElementById("musicToggle");
  const bgm = document.getElementById("bgm");

  const STORAGE_KEY_PLAYING = "aya_blog_music_playing";
  const STORAGE_KEY_TIME = "aya_blog_music_time";

  const syncMusicButton = (playing) => {
    if (!musicToggle) return;

    musicToggle.textContent = playing ? "⏸ Music" : "♫ Music";
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
  };

  if (musicToggle && bgm) {
    const savedTime = parseFloat(localStorage.getItem(STORAGE_KEY_TIME) || "0");
    if (!Number.isNaN(savedTime)) {
      bgm.currentTime = savedTime;
    }

    syncMusicButton(false);

    musicToggle.addEventListener("click", async () => {
      if (bgm.paused) {
        try {
          await bgm.play();
          localStorage.setItem(STORAGE_KEY_PLAYING, "true");
          syncMusicButton(true);
        } catch (error) {
          console.error("Music playback failed:", error);
          syncMusicButton(false);
        }
      } else {
        bgm.pause();
        localStorage.setItem(STORAGE_KEY_PLAYING, "false");
        localStorage.setItem(STORAGE_KEY_TIME, String(bgm.currentTime));
        syncMusicButton(false);
      }
    });

    bgm.addEventListener("timeupdate", () => {
      localStorage.setItem(STORAGE_KEY_TIME, String(bgm.currentTime));
    });

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(STORAGE_KEY_TIME, String(bgm.currentTime));
      localStorage.setItem(STORAGE_KEY_PLAYING, String(!bgm.paused));
    });
  }

  /* =========================
     Modal
  ========================= */
  const modals = Array.from(document.querySelectorAll(".modal"));
  const modalOpenButtons = Array.from(document.querySelectorAll(".open-modal"));

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  modalOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-modal]");
      const targetId = card?.dataset.modal;
      const modal = targetId ? document.getElementById(targetId) : null;
      openModal(modal);
    });
  });

  modals.forEach((modal) => {
    const closeButton = modal.querySelector(".modal__close");
    const backdrop = modal.querySelector("[data-close='true']");

    closeButton?.addEventListener("click", () => closeModal(modal));
    backdrop?.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    modals.forEach((modal) => {
      if (modal.classList.contains("is-open")) {
        closeModal(modal);
      }
    });
  });
})();

