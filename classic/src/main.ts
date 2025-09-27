import { Audio } from "./audio";
import { ChatBot } from "./chatbot";
import { CountDown } from "./countdown";
import { LandingPage } from "./landing";

import './styles/chatbot.css'
import './styles/landing-page.css'
import './styles/simplyCountdown.css'
import './styles/style.css'

export interface Module {
  init(): void;
}

export class RootClass {
  private modules: Module[] = [];

  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.modules = [
        new CountDown(),
        new Audio(),
        new LandingPage(),
        new ChatBot()
      ];
      this.modules.forEach(m => m.init());
    });
  }

}

new RootClass();