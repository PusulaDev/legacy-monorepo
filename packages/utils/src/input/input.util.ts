import { EnumKeyboardKey } from "./keyboard-key.enum";

export class InputUtil {
  isKeyAvailableOnNumberInput(
    evt: KeyboardEvent,
    isOnlyInteger: boolean,
    enableNegative?: boolean,
    decimalSeperatorChar: string = "."
  ) {
    if (evt.key == EnumKeyboardKey.Enter) return true;

    let value = (evt.target as HTMLInputElement).value;
    let keyIsNumber = !isNaN(evt.key as any);

    let cursorIndex = (evt.target as HTMLInputElement).selectionStart;

    if (enableNegative && evt.key == EnumKeyboardKey.Minus) {
      let intValue = parseFloat(value);
      if (intValue != 0 && value.indexOf("-") == -1 && cursorIndex == 0) return true;
      else evt.preventDefault();
    } else if (!isOnlyInteger && evt.key == decimalSeperatorChar) {
      if (value.indexOf(decimalSeperatorChar) == -1) return true;
      else evt.preventDefault();
    } else if (!keyIsNumber) {
      evt.preventDefault();
    } else {
      return true;
    }
  }
}

export const inputUtil = new InputUtil();
