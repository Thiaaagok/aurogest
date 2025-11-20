import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionTimerService {
  timeLeft = signal(0);

  start() {
    const exp = Number(localStorage.getItem('token_exp'));
    setInterval(() => {
      const diff = exp * 1000 - Date.now();
      this.timeLeft.set(diff);

      if (diff <= 0) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }, 1000);
  }
}