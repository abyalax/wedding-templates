import type { Module } from '../main';

export class Audio implements Module {
  init = () => this.bindEvents();

  private bindEvents() {
    const rootElement = document.querySelector(':root') as HTMLElement;
    const audioIconWrapper = document.querySelector('.audio-icon-wrapper') as HTMLDivElement;
    const song = document.querySelector('#song') as HTMLAudioElement;
    const audioIcon = document.querySelector('.audio-icon-wrapper i') as HTMLElement;
    const btnEnableScroll = document.getElementById('btn-enable-scroll') as HTMLButtonElement;
    const navbar = document.querySelector('nav') as HTMLElement;

    let isPlaying = false;

    function playAudio() {
      if (song && audioIconWrapper) {
        song.volume = 0.8;
        audioIconWrapper.style.display = 'flex';
        song.play();
        isPlaying = true;
      }
    }

    function disableScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      window.onscroll = () => {
        window.scrollTo(scrollTop, scrollLeft);
      };

      if (rootElement) {
        rootElement.style.scrollBehavior = 'auto';
      }
    }

    function enableScroll() {
      window.onscroll = () => {};
      navbar?.classList.remove('d-none');
      if (rootElement) {
        rootElement.style.scrollBehavior = 'smooth';
      }
      playAudio();
    }

    disableScroll();

    btnEnableScroll.addEventListener('click', () => enableScroll());

    audioIconWrapper.addEventListener('click', () => {
      if (!song || !audioIcon) return;

      if (isPlaying) {
        song.pause();
        audioIcon.classList.remove('bi-disc');
        audioIcon.classList.add('bi-pause-circle');
      } else {
        song.play();
        audioIcon.classList.add('bi-disc');
        audioIcon.classList.remove('bi-pause-circle');
      }

      isPlaying = !isPlaying;
    });
  }
}
