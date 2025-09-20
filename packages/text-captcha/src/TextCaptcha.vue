<script lang="ts" setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { CaptchaOptions, EnumLanguagePrefix } from './types';
import { textCaptchaHelper } from "@/text-captcha.helper";

const props = withDefaults(
    defineProps<{
        value?: string | null;
        language?: string | null;
        chars?: string;
        count?: number;
        hideLines?: boolean;
        customTextColor?: string;
        textColors?: string[];
        width?: number;
        height?: number;
        canvasClass?: string;
        icon?: string;
        captchaFont?: string;
        hideRefreshIcon?: boolean;
    }>(),
    {
        value: "",
        language: null,
        chars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        count: 5,
        hideLines: false,
        customTextColor: "",
        textColors: () => [],
        width: 150,
        height: 50,
        canvasClass: "",
        icon: "refresh",
        captchaFont: "bold 24px sans-serif",
        hideRefreshIcon: false,
    }
);
const emit = defineEmits<{
    (event: "is-valid", value: boolean): void;
    (event: "get-code", value: string): void;
}>();

const captcha_canvas = ref<HTMLCanvasElement | null>(null);
const code = ref("");

const toOpts = (): CaptchaOptions => ({
    chars: effectiveChars.value,
    count: Number(props.count),
    hideLines: props.hideLines,
    customTextColor: props.customTextColor,
    textColors: props.textColors ?? [],
    width: Number(props.width ?? Number(props.count) * 30),
    height: Number(props.height),
    captchaFont: String(props.captchaFont),
    isRtl: isRtl.value,
});

const generate = () => {
    if (!captcha_canvas.value) return;

    code.value = textCaptchaHelper().drawCaptcha(captcha_canvas.value, toOpts());
    emit("get-code", code.value);
};

const resetCaptcha = () => generate();

const currentLang = computed(() => textCaptchaHelper().normLang(props.language));
const isRtl = computed(() =>
    currentLang.value
        ? textCaptchaHelper().RTL_LANGUAGES.has(currentLang.value as EnumLanguagePrefix)
        : false
);
const effectiveChars = computed(
  () => textCaptchaHelper().charsForLanguage(currentLang.value) ?? props.chars
);
onMounted(() => generate());
watchEffect(() => emit("is-valid", !!code.value && code.value === (props.value ?? "")));
defineExpose({ resetCaptcha });
</script>

<template>
    <div class="client_recaptcha" :dir="isRtl ? 'rtl' : 'ltr'">
        <div v-if="!hideRefreshIcon" class="client_recaptcha_icon" @click="resetCaptcha">
            <slot name="icon">
                <svg
                    class="client_recaptcha_icon_svg"
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 12a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.706 6.706 0 0 1 11 19c-6.24 0-9.36-7.54-4.95-11.95C10.46 2.64 18 5.77 18 12h-3l4 4h.1l3.9-4h-3a9 9 0 0 0-18 0Z"
                        fill="#333333"
                    />
                </svg>
            </slot>
        </div>

        <canvas id="captcha_canvas" ref="captcha_canvas" :class="['captcha_canvas', canvasClass]" />
    </div>
</template>

<style scoped>
.client_recaptcha {
    display: flex;
    justify-content: center;
    flex-direction: row;
}
.client_recaptcha_icon {
    text-align: center;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    transition: background-color 0.3s ease-in-out;
}
.client_recaptcha_icon:hover {
    background-color: #cccccc;
}
.client_recaptcha .captcha_canvas {
    background: #eee;
}
</style>
