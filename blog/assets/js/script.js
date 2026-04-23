document.getElementById("year").textContent = new Date().getFullYear();

const musicToggle = document.getElementById("musicToggle");
const bgm = document.getElementById("bgm");

if (musicToggle && bgm) {
  musicToggle.addEventListener("click", async () => {
    if (bgm.paused) {
      try {
        await bgm.play();
        musicToggle.textContent = "⏸ Music";
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
      } catch (error) {
        console.error(error);
      }
    } else {
      bgm.pause();
      musicToggle.textContent = "♫ Music";
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });
}
