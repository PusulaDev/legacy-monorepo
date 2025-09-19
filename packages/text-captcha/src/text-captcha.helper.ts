import { CaptchaOptions } from './types';

class TextCaptchaHelper {
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

        const { width, height, count, chars, captchaFont, hideLines, customTextColor, textColors } =
            opts;

        canvas.width = Number(width);
        canvas.height = Number(height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let code = "";

        for (let i = 0; i < count; i++) {
            const sIndex = Math.floor(Math.random() * chars.length);
            const sDeg = (Math.random() * 30 * Math.PI) / 180;
            const cTxt = chars[sIndex];
            code += cTxt;

            const x = 10 + i * 25;
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
