# @pusula/text-captcha

A lightweight, canvas-based **text CAPTCHA** component for **Vue 2.7 + TypeScript**.  
Includes language-aware character sets, **RTL (right-to-left)** layout, customizable colors, and a standalone helper API.

---

## ✨ Features

- 🌍 **Language-aware** character sets via `language` prop (e.g., `tr-TR`, `en`, `ar-SA`)
- ↔️ **RTL/LTR** drawing support (Arabic, Hebrew, Persian, etc.)
- 🎨 Custom text color or a random color **palette**
- 🧩 Optional noise lines
- 🧰 Framework-agnostic **helper** to draw directly on `<canvas>`
- 🧪 TypeScript types included

---

## 📦 Installation

```bash
# pnpm
pnpm add @pusula/text-captcha

# yarn
yarn add @pusula/text-captcha

# npm
npm i @pusula/text-captcha
```

**Peer dependency**
- `vue` **^2.7.0**

---

## 🚀 Quick Start (Vue 2.7 with `<script setup>`)

```vue
<script lang="ts" setup>
import { ref } from "vue";
import TextCaptcha from "@pusula/text-captcha";

const input = ref("");      // user's input (v-model)
const code = ref("");       // emitted generated code
const valid = ref(false);   // emitted validation flag
</script>

<template>
  <div>
    <TextCaptcha
      v-model="input"
      :language="'tr-TR'"          <!-- or 'en', 'ar-SA', etc. -->
      :count="5"
      :width="220"
      :height="64"
      @get-code="code = $event"
      @is-valid="valid = $event"
    />

    <input v-model="input" placeholder="Type the code" />
    <p>Valid? {{ valid ? 'Yes' : 'No' }}</p>
    <small>Generated: {{ code }}</small>
  </div>
</template>
```

> When `language` is provided and known, the component uses an appropriate character set. Otherwise it falls back to `chars`.

---

## ⚙️ Props

| Prop               | Type                  | Default                         | Description |
|--------------------|-----------------------|---------------------------------|-------------|
| `value` (v-model)  | `string \| null`      | `""`                            | User input bound with `v-model`. |
| `language`         | `string \| null`      | `null`                          | Language code (e.g., `tr-TR`, `en`, `ar-SA`). Enables language-aware char sets & RTL detection. |
| `chars`            | `string`              | Latin alphanumeric              | Fallback set when `language` is not provided or not supported. |
| `count`            | `number`              | `5`                             | Number of characters to draw. |
| `hideLines`        | `boolean`             | `false`                         | Hide noise lines if `true`. |
| `customTextColor`  | `string`              | `""`                            | Single color for all glyphs (any valid CSS color). |
| `textColors`       | `string[]`            | `[]`                            | Palette to randomly pick per glyph. Ignored if `customTextColor` is set. |
| `width`            | `number`              | `150`                           | Canvas width (px). |
| `height`           | `number`              | `50`                            | Canvas height (px). |
| `canvasClass`      | `string`              | `""`                            | Extra class for the canvas element. |
| `icon`             | `string`              | `"refresh"`                     | Key name for the refresh icon (not used if you provide a slot). |
| `captchaFont`      | `string`              | `"bold 24px sans-serif"`        | Canvas font string. |
| `hideRefreshIcon`  | `boolean`             | `false`                         | Hide the refresh button if `true`. |

**Priority:** If `language` is recognized, its character set is used; otherwise `chars` is used.

---

## 📡 Events

| Event        | Payload   | Description |
|--------------|-----------|-------------|
| `get-code`   | `string`  | The generated CAPTCHA code. |
| `is-valid`   | `boolean` | `true` when `v-model` value equals the generated code. |

---

## 🧠 Methods (Exposed)

`resetCaptcha()` is exposed by the component instance:

```vue
<script lang="ts" setup>
import { ref } from "vue";
import TextCaptcha from "@pusula/text-captcha";

const captchaRef = ref<InstanceType<typeof TextCaptcha> | null>(null);
const refresh = () => captchaRef.value?.resetCaptcha();
</script>

<template>
  <TextCaptcha ref="captchaRef" />
  <button @click="refresh">Refresh</button>
</template>
```

---

## 🌍 Language & RTL

- The `language` prop enables a language-aware character set and auto RTL for languages like **Arabic (`ar`)**, **Persian (`fa`)**, **Hebrew (`he`)**, etc.
- In RTL, characters are drawn from **right to left** with safe padding so they don’t get clipped.

Examples:

```vue
<!-- Arabic (RTL) -->
<TextCaptcha :language="'ar-SA'" :count="6" />

<!-- Turkish -->
<TextCaptcha :language="'tr-TR'" :count="6" />

<!-- Custom charset: remove ambiguous chars (O/0, l/1) -->
<TextCaptcha :chars="'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'" />
```

---

## 🎨 Styling

Default classes (simplified):

```css
.client_recaptcha { display: flex; flex-direction: row; justify-content: center; }
.client_recaptcha_icon { padding: 10px; cursor: pointer; background: #eee; transition: background .3s; }
.client_recaptcha_icon:hover { background: #ccc; }
.client_recaptcha .captcha_canvas { background: #eee; display: block; } /* block avoids inline gaps */
```

You can override them in your app/theme.

---

## 🧰 Helper API (No Vue Required)

Draw directly on a `<canvas>` element:

```ts
import { textCaptchaHelper } from "@pusula/text-captcha";
import type { CaptchaOptions } from "@pusula/text-captcha";

const helper = textCaptchaHelper();

const code = helper.drawCaptcha(canvasEl, {
  chars: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  count: 5,
  width: 220,
  height: 64,
  captchaFont: "bold 28px system-ui",
  hideLines: false,
  customTextColor: "",
  textColors: ["#222", "#444", "#666"],
  isRtl: false, // set true for RTL languages
} satisfies CaptchaOptions);

console.log("Generated:", code);
```

**`CaptchaOptions`**
```ts
export interface CaptchaOptions {
  chars: string;
  count: number;
  hideLines?: boolean;
  customTextColor?: string;
  textColors?: string[];
  width: number;
  height: number;
  captchaFont: string;
  isRtl?: boolean; // true for RTL languages
}
```

---

## 🔐 Security Notice

This package provides a **simple text-based CAPTCHA**. It is **not** sufficient on its own against advanced automated attacks. Consider:
- Longer codes and stricter character sets
- Server-side rate limiting
- Retry/refresh requirements
- Additional anti-bot techniques (device fingerprint, behavior checks, etc.)

---

## 🤝 Contributing

PRs are welcome!
- Code style: Prettier
- Language: TypeScript

---

## 📄 License

MIT

---

**Tips**
- Increase `width` when you increase `captchaFont` size to avoid clipping.
- For RTL languages, slightly wider `width` provides better visual spacing.
