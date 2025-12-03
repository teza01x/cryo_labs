# CRYO LABS — Pixel Laboratory Aesthetic 🧊

## Что я сделал

Полностью переосмыслил дизайн в стиле **пиксельных sandbox игр** (Powder Game, Sandspiel) + **лабораторный terminal UI**.

---

## 🎨 Новая концепция дизайна

### 1. **Pixel Laboratory Aesthetic**

Вместо обычного лендинга — **интерактивная пиксельная лаборатория**:

- **8px grid system** — всё выровнено по пиксельной сетке
- **Terminal-inspired UI** — команды, кронштейны `[ ]`, префиксы `>`
- **Pixel-perfect rendering** — `image-rendering: pixelated`
- **Scanline overlay** — эффект ЭЛТ-монитора поверх всего сайта

### 2. **Ice Laboratory Color Palette**

Полностью новая палитра в духе ледяной лаборатории:

```css
--lab-bg: #0d1117        /* Темный фон лаборатории */
--lab-surface: #161b22    /* Поверхности оборудования */
--lab-border: #30363d     /* Границы модулей */
--ice-primary: #58a6ff    /* Основной синий лед */
--ice-light: #79c0ff      /* Светлый ледяной */
--ice-glow: #1f6feb       /* Свечение льда */
--ice-crystal: #8ed9ff    /* Кристаллы */
--frost: #c9d1d9          /* Изморозь (текст) */
--dark-ice: #0969da       /* Темный лед (тени) */
```

### 3. **Pixel UI Elements**

**Кнопки:**
- 3D pixel buttons с inset тенями
- Эффект "нажатия" (transform на hover/active)
- Steps transitions для pixel-perfect анимаций

**Карточки:**
- Pixel scan line эффект при hover
- Двойная граница при наведении (offset border)
- Диагональная frost overlay полоска

**Типографика:**
- `JetBrains Mono` для всего (моноширинный)
- UPPERCASE для заголовков
- Pixel text shadow (2px offset)
- Мерцание title как в терминале

---

## 🎮 Интерактивные элементы

### Header
```
CRYO LABS
</> ICE.LAB.v2.0
[SERVICES] [PROJECTS] [CONTACT]
```

- Пульсирующий пиксельный куб льда (logo)
- Terminal-style навигация с квадратными скобками
- Box borders на hover с glow эффектом

### Hero
```
> ИНИЦИАЛИЗАЦИЯ ЛАБОРАТОРИИ...
> ЗАГРУЗКА МОДУЛЕЙ: [WEB2] [WEB3] [DESIGN]
> СТАТУС: ГОТОВ К РАБОТЕ
```

- Terminal boot sequence стиль
- Мерцание заголовка (как у старых мониторов)
- Вертикальные полоски на фоне (lab equipment)

### Services — "Лабораторные модули"
```
▓ [ WEB DEVELOPMENT ]
> SPA, SSR, PWA
> React, Next.js, Vite
> Производительность: 100/100
```

- Геометрические иконки (▓ ◆ ◢ ◣)
- Scan line анимация при hover
- Двойная граница offset эффект
- Pre-line текст с `>`

### Portfolio — "Результаты экспериментов"
```
AURORA_PROTOCOL
[WEB3] • [DEFI]
> Децентрализованная платформа
```

- Диагональные полоски в thumbnail (ice pattern)
- UPPERCASE названия проектов
- Tech tags как terminal labels
- Scanline overlay на hover

### Contact — "Протоколы связи"
```
> EMAIL_PROTOCOL
> TELEGRAM_CHANNEL
> GITHUB_REPOSITORY
```

- Terminal-style form labels
- Glow эффект на focus
- Steps animation для transitions

---

## 🔧 Технические особенности

### 1. **Pixel-Perfect Grid**
```css
--pixel: 8px
--grid-1 до --grid-12
```
Все отступы кратны 8px.

### 2. **CRT Monitor Effect**
```css
body::before {
  repeating-linear-gradient(scanlines...)
  mix-blend-mode: overlay
}
```

### 3. **Steps Animations**
```css
transition: all 0.1s steps(2);
```
Вместо smooth — stepped для pixel aesthetic.

### 4. **Pixel Shadows**
```css
box-shadow:
  inset -2px -2px 0 var(--dark-ice),
  inset 2px 2px 0 var(--ice-light),
  0 0 16px var(--ice-glow);
```

### 5. **Image Rendering**
```css
image-rendering: pixelated;
-webkit-font-smoothing: none;
```

---

## 📦 Что изменилось

### До:
❌ Минималистичный "современный" дизайн
❌ Gradient текст
❌ Smooth transitions
❌ Эмодзи иконки
❌ Нормальный шрифт (Inter)

### После:
✅ Pixel laboratory terminal UI
✅ Pixel text shadows
✅ Steps transitions
✅ Геометрические ASCII иконки
✅ Моноширинный шрифт везде (JetBrains Mono)
✅ Terminal commands стиль (>, [], //)
✅ CRT scanline overlay
✅ Ice glow effects
✅ 8px grid system
✅ 3D pixel buttons

---

## 🎯 Вдохновение

Дизайн вдохновлен:

1. **Powder Game / Sandspiel** — pixel sandbox aesthetics
2. **GitHub Dark Theme** — lab color palette
3. **DOS/Terminal UI** — command-line interface
4. **Retro CRT monitors** — scanlines, flicker
5. **Ice crystals** — geometric shapes, glow effects

---

## 🚀 Результат

Теперь это **не просто лендинг**, а:

- ❄️ Интерактивная пиксельная лаборатория
- 🖥️ Terminal-inspired интерфейс
- 🎮 Sandbox game aesthetic
- 🧊 Ice laboratory theme
- 📦 8px pixel-perfect grid

**Открой [http://localhost:5173](http://localhost:5173) и увидишь!**

---

## Источники вдохновения

- [Sandboxels](https://sandboxels.r74n.com/) — Pixel sandbox simulator
- [Sandspiel](https://sandspiel.club/) — Creative powder game
- [Powder Game](https://dan-ball.jp/en/javagame/dust/) — Original falling sand
- [GitHub Dark Theme](https://github.com) — Ice blue palette
- [One Page Love — Pixel Art](https://onepagelove.com/tag/pixel-art) — Pixel websites

---

**Это уже не "обновленная версия старого дизайна" — это полностью новая концепция! 🔥**
