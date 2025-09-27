import simplyCountdown from '../../node_modules/simplycountdown.js/src/core/simplyCountdown';
import type { Module } from '../main';

export class CountDown implements Module {
  init = () => this.bindEvents();

  private bindEvents() {
    const pengantinPria = 'Putra Cipto Mangunkusumo';
    const pengantinWanita = 'Selvy Rirantri';
    const year = 2025;
    const month = 12;
    const day = 21;
    const hours = 8;

    const priaElements = document.querySelectorAll('.pria');
    const wanitaElements = document.querySelectorAll('.wanita');

    priaElements.forEach((element) => {
      element.textContent = pengantinPria;
    });

    wanitaElements.forEach((element) => {
      element.textContent = pengantinWanita;
    });

    simplyCountdown('.simply-countdown', {
      year: year,
      month: month,
      day: day,
      hours: hours,
      words: {
        days: {
          lambda: () => 'day',
          root: 'day',
        },
        hours: {
          lambda: () => 'hours',
          root: 'hours',
        },
        minutes: {
          lambda: () => 'minutes',
          root: 'minutes',
        },
        seconds: {
          lambda: () => 'seconds',
          root: 'seconds',
        },
      },
    });
  }
}
