<template>
  <div class="wrap">
    <h2>TextCaptcha Demo</h2>

    <div class="row">
      <TextCaptcha
        ref="captcha"
        :value="userInput"
        :count="5"
        :width="220"
        :height="60"
        :text-colors="['#2c3e50', '#e67e22', '#16a085']"
        @get-code="onCode"
        @is-valid="checkValidCaptcha"
      />
      <button class="btn" @click="refresh">Yenile</button>
    </div>

    <div class="row">
      <input
        v-model="userInput"
        class="input"
        placeholder="Güvenlik kodunu girin"
      />
      <span class="label">Geçerli mi?</span>
      <span :class="['pill', isValid ? 'ok' : 'no']">
        {{ isValid ? 'Evet' : 'Hayır' }}
      </span>
    </div>

    <p class="hint">Üretilen kod: <b>{{ code }}</b></p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TextCaptcha } from "@lib";

const code = ref("");
const userInput = ref("");
const isValid = ref(false);
const captcha = ref<InstanceType<typeof TextCaptcha> | null>(null);

const onCode = (newCode: string) => code.value = newCode;
const refresh = () => (captcha.value as any)?.resetCaptcha?.();
const checkValidCaptcha = (value: boolean) => isValid.value = value;
</script>

<style scoped>
.wrap { padding: 24px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
.row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
.input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; }
.btn { padding: 8px 12px; border: 1px solid #999; background: #f6f6f6; border-radius: 6px; cursor: pointer; }
.btn:hover { background: #eee; }
.label { font-weight: 600; color: #333; }
.pill { padding: 4px 10px; border-radius: 999px; font-weight: 700; }
.pill.ok { background: #e8f7ec; color: #0a8f2f; }
.pill.no { background: #fdeaea; color: #c21d1d; }
.hint { margin-top: 8px; color: #666; }
</style>
