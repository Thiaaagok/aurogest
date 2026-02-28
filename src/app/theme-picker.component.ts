// theme/theme-picker.component.ts
import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';


@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="picker-wrap">
      <button class="trigger" (click)="toggle()" [title]="'Personalizar tema'">
        <span class="dot" [style.background]="theme.accent()"></span>
      </button>

      <div class="panel" [class.open]="open">
        <div class="panel-title">Personalizar</div>

        <div class="section-label">Colores</div>
        <div class="presets">
          <button
            *ngFor="let p of theme.presets"
            class="preset"
            [class.active]="theme.accent() === p.hex"
            [style.background]="p.hex"
            [title]="p.name"
            (click)="pick(p.hex)">
          </button>
        </div>

        <div class="section-label" style="margin-top:.875rem">Personalizado</div>
        <input
          type="color"
          class="custom-color"
          [value]="theme.accent()"
          (input)="onCustom($event)">

        <div class="divider"></div>

        <div class="modes">
          <button class="mode-btn" [class.active]="theme.mode()==='dark'" (click)="theme.setMode('dark')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
            </svg>
            Oscuro
          </button>
          <button class="mode-btn" [class.active]="theme.mode()==='light'" (click)="theme.setMode('light')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            Claro
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .picker-wrap { position: relative; }

    .trigger {
      width: 36px; height: 36px;
      border: none;
      background: var(--ag-accent-dim);
      border-radius: 9px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    .trigger:hover { background: var(--ag-accent-glow); }

    .dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      transition: background .2s;
      box-shadow: 0 0 8px var(--ag-accent-glow);
    }

    .panel {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: var(--ag-surface2);
      border: 1px solid var(--ag-border);
      border-radius: 14px;
      padding: 1.1rem;
      width: 230px;
      box-shadow: 0 24px 64px rgba(0,0,0,.45);
      opacity: 0;
      transform: translateY(-10px) scale(.96);
      pointer-events: none;
      transition: opacity .18s, transform .18s;
      z-index: 500;
    }
    .panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .panel-title {
      font-size: .78rem;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--ag-text);
      margin-bottom: 1rem;
    }

    .section-label {
      font-size: .67rem;
      font-weight: 600;
      letter-spacing: .09em;
      text-transform: uppercase;
      color: var(--ag-text-muted);
      margin-bottom: .5rem;
    }

    .presets {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: .5rem;
    }

    .preset {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2.5px solid transparent;
      cursor: pointer;
      transition: transform .15s, border-color .15s, box-shadow .15s;
    }
    .preset:hover { transform: scale(1.18); }
    .preset.active {
      border-color: #fff;
      box-shadow: 0 0 0 3px rgba(255,255,255,.2);
    }

    .custom-color {
      width: 100%;
      height: 38px;
      border: 1px solid var(--ag-border);
      border-radius: 9px;
      background: var(--ag-surface3);
      cursor: pointer;
      padding: 3px;
    }

    .divider {
      height: 1px;
      background: var(--ag-border);
      margin: .875rem 0;
    }

    .modes {
      display: flex;
      gap: .375rem;
    }

    .mode-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .375rem;
      padding: .45rem .5rem;
      border: 1px solid var(--ag-border);
      border-radius: 8px;
      background: transparent;
      color: var(--ag-text-muted);
      font-size: .75rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all .15s;
    }
    .mode-btn:hover { border-color: var(--ag-accent); color: var(--ag-text); }
    .mode-btn.active {
      background: var(--ag-accent-dim);
      border-color: var(--ag-accent);
      color: var(--ag-accent-light);
    }
  `]
})
export class ThemePickerComponent {
  theme = inject(ThemeService);
  open = false;

  private el = inject(ElementRef);

  toggle(): void { this.open = !this.open; }

  pick(hex: string): void { this.theme.setAccent(hex); }

  onCustom(e: Event): void {
    this.theme.setAccent((e.target as HTMLInputElement).value);
  }

  @HostListener('document:click', ['$event'])
  onOutside(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) this.open = false;
  }
}
