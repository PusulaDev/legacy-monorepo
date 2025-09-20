import { CaptchaOptions, EnumLanguagePrefix } from './types';

class TextCaptchaHelper {
    readonly RTL_LANGUAGES = new Set([EnumLanguagePrefix.ar, EnumLanguagePrefix.fa, EnumLanguagePrefix.he]);

    charsForLanguage = (currentLang?: string | null): string | null => {
        if (!currentLang) return null;

        switch (currentLang) {
            case EnumLanguagePrefix.tr:
                return "abcçdefgğhıijklmnoöprsştuüvyzABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789";
            case EnumLanguagePrefix.az:
                return "abcçdeəfgğhxıijkqlmnoöprsştuüvyzABCÇDEƏFGĞHXIİJKQLMNOÖPRSŞTUÜVYZ0123456789";
            case EnumLanguagePrefix.de:
                return "abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789";
            case EnumLanguagePrefix.hu:
                return "aábcdeéfghiíjklmnoóöőprsstuúüűvyzAÁBCDEÉFGHIÍJKLMNOÓÖŐPRSSTUÚÜŰVYZ0123456789";
            case EnumLanguagePrefix.sq:
                return "a b c ç d dh e ë f g gj h i j k l ll m n nj o p q r rr s sh t th u v x xh y z zh A B C Ç D DH E Ë F G GJ H I J K L LL M N NJ O P Q R RR S SH T TH U V X XH Y Z ZH 0 1 2 3 4 5 6 7 8 9".replace(
                /\s+/g,
                ""
                );
            case EnumLanguagePrefix.sr:
                return "abcčćdđefghijklmnnjoprsštuvzžABCČĆDĐEFGHIJKLMNOPRSŠTUVZŽ0123456789";
            case EnumLanguagePrefix.en:
                return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            case EnumLanguagePrefix.ar:
                return "ابتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩";
            case EnumLanguagePrefix.fa:
                return "ابپتثجچحخدذرزژسشصضطظعغفقکلمنوهی۰۱۲۳۴۵۶۷۸۹";
            case EnumLanguagePrefix.he:
                return "אבגדהוזחטיךכלםמןנסעףפץצקרשת0123456789";
            default:
                return null;
        }
    };

    normLang = (lang?: string | null): string | null => {
        if (!lang) return null;

        const trimmed = lang.trim().toLowerCase();
        const match = trimmed.match(/^[a-z]{2}/);
        return match ? match[0] : trimmed;
  }

    randomColor(): string {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        return `rgb(${r},${g},${b})`;
    }

    drawNoiseLines(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        count: number
    ): void {
        for (let i = 0; i < count; i++) {
            ctx.strokeStyle = this.randomColor();
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.stroke();
        }
    }

    drawCaptcha(canvas: HTMLCanvasElement, opts: CaptchaOptions): string {
        const ctx = canvas.getContext("2d");
        if (!ctx) return "";

        const { width, height, count, chars, captchaFont, hideLines, customTextColor, textColors, isRtl } =
            opts;

        canvas.width = Number(width);
        canvas.height = Number(height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const paddingX = 10;
        const step = Math.max(18, Math.floor((canvas.width - paddingX * 2) / Math.max(1, count)));
        const baseX = isRtl ? (canvas.width - paddingX) : paddingX;

        let code = "";

        for (let i = 0; i < count; i++) {
            const sIndex = Math.floor(Math.random() * chars.length);
            const sDeg = (Math.random() * 30 * Math.PI) / 180;
            const cTxt = chars[sIndex];
            code += cTxt;

            const x = isRtl ? (baseX - i * step) : (baseX + i * step);
            const y = 30 + Math.random() * 8;

            ctx.save();
            ctx.font = captchaFont;
            ctx.translate(x, y);
            ctx.rotate(sDeg);

            if (customTextColor && customTextColor.length) {
                ctx.fillStyle = customTextColor;
            } else if (textColors && textColors.length) {
                ctx.fillStyle = textColors[Math.floor(Math.random() * textColors.length)];
            } else {
                ctx.fillStyle = this.randomColor();
            }

            ctx.fillText(cTxt, 0, 0);
            ctx.restore();
        }

        if (!hideLines) this.drawNoiseLines(ctx, canvas.width, canvas.height, count);

        return code;
    }
}

export const textCaptchaHelper = () => new TextCaptchaHelper();
