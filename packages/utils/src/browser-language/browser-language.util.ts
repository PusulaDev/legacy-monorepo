export const getBrowserLang = () => {
  if (!navigator) return "";

  let locale = "";
  if (navigator.languages != undefined) {
    locale = navigator.languages[0];
  } else {
    locale = navigator.language;
  }
  locale = locale.toLowerCase();
  return locale;
};
