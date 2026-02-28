// theme/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

export interface ThemePreset {
  name: string;
  hex: string;
}

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly presets: ThemePreset[] = [
    { name: 'Índigo',    hex: '#6C63FF' },
    { name: 'Cielo',     hex: '#0EA5E9' },
    { name: 'Esmeralda', hex: '#10B981' },
    { name: 'Ámbar',     hex: '#F59E0B' },
    { name: 'Rojo',      hex: '#EF4444' },
    { name: 'Rosa',      hex: '#EC4899' },
    { name: 'Violeta',   hex: '#8B5CF6' },
    { name: 'Teal',      hex: '#14B8A6' },
    { name: 'Naranja',   hex: '#F97316' },
    { name: 'Cyan',      hex: '#06B6D4' },
  ];

  accent  = signal<string>(localStorage.getItem('ag-accent') ?? '#6C63FF');
  mode    = signal<ThemeMode>((localStorage.getItem('ag-mode') as ThemeMode) ?? 'dark');

  constructor() {
    effect(() => this.applyTheme(this.accent(), this.mode()));
    // Aplicar inmediatamente al arrancar
    this.applyTheme(this.accent(), this.mode());
  }

  setAccent(hex: string): void {
    this.accent.set(hex);
    localStorage.setItem('ag-accent', hex);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem('ag-mode', mode);
  }

  private applyTheme(hex: string, mode: ThemeMode): void {
    const root = document.documentElement;

    // Accent colors
    root.style.setProperty('--ag-accent',       hex);
    root.style.setProperty('--ag-accent-light',  this.lighten(hex, 25));
    root.style.setProperty('--ag-accent-dim',    hex + '1F');
    root.style.setProperty('--ag-accent-glow',   hex + '3D');

    // Mode surfaces
    if (mode === 'dark') {
      root.style.setProperty('--ag-bg',           '#0D0D12');
      root.style.setProperty('--ag-surface',      '#13131A');
      root.style.setProperty('--ag-surface2',     '#1A1A24');
      root.style.setProperty('--ag-surface3',     '#22222F');
      root.style.setProperty('--ag-border',       'rgba(255,255,255,.07)');
      root.style.setProperty('--ag-border-h',     'rgba(255,255,255,.13)');
      root.style.setProperty('--ag-text',         '#F0F0F8');
      root.style.setProperty('--ag-text-muted',   '#6B6B80');
      root.style.setProperty('--ag-text-faint',   '#3A3A50');
      document.body.classList.remove('ag-light');
      document.body.classList.add('ag-dark');
    } else {
      root.style.setProperty('--ag-bg',           '#F0F0F6');
      root.style.setProperty('--ag-surface',      '#FFFFFF');
      root.style.setProperty('--ag-surface2',     '#F4F4FA');
      root.style.setProperty('--ag-surface3',     '#EAEAF4');
      root.style.setProperty('--ag-border',       'rgba(0,0,0,.08)');
      root.style.setProperty('--ag-border-h',     'rgba(0,0,0,.15)');
      root.style.setProperty('--ag-text',         '#0D0D14');
      root.style.setProperty('--ag-text-muted',   '#70708A');
      root.style.setProperty('--ag-text-faint',   '#C0C0D0');
      document.body.classList.remove('ag-dark');
      document.body.classList.add('ag-light');
    }
  }

  private lighten(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
