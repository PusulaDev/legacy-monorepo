export abstract class DateUtil {
  static removeSecondFromTimeSpan(timespan: string) {
    if (timespan.indexOf(":") > -1) {
      let arr = timespan.split(":");
      if (arr.length == 3) {
        return `${arr[0]}:${arr[1]}:00`;
      }
    }

    return "";
  }
  static timeFormatFromApiDateString(dateString: string, hasSeconds?: boolean): string {
    if (dateString) {
      let date = new Date(dateString);
      if (date) {
        return this.timeFormat(date, hasSeconds);
      }
    }
    return "";
  }
  static dateTimeFormatFromApiDateString(dateString: string): string {
    if (dateString) {
      let date = new Date(dateString);
      if (date) {
        return this.dateTimeFormat(date);
      }
    }
    return "";
  }
  static dateTimeFormat(date: Date): string {
    if (date) {
      let day: string | number = date.getDate();
      if (day <= 9) day = "0" + day;

      let month: string | number = date.getMonth() + 1;
      if (month <= 9) month = "0" + month;

      let hour: number | string = date.getHours();
      if (hour <= 9) hour = "0" + hour;
      let minute: number | string = date.getMinutes();
      if (minute <= 9) minute = "0" + minute;

      return `${day}.${month}.${date.getFullYear()} ${hour}:${minute}`;
    }
    return "";
  }
  /**
   * converts backend date string to javascript date object
   * @param dateString string value of Date object
   */
  static dateFormatFromApiDateString(dateString: string): string {
    if (dateString) {
      let date = new Date(dateString);
      if (date) {
        return this.dateFormat(date);
      }
    }
    return "";
  }
  static dateFormat(date: Date): string {
    if (date) {
      let day: string | number = date.getDate();
      if (day <= 9) day = "0" + day;

      let month: string | number = date.getMonth() + 1;
      if (month <= 9) month = "0" + month;

      return `${day}.${month}.${date.getFullYear()}`;
    }
    return "";
  }
  static timeFormat(date: Date, hasSeconds?: boolean): string {
    if (date) {
      let hour: string | number = date.getHours();
      if (hour <= 9) hour = "0" + hour;

      let minute: string | number = date.getMinutes();
      if (minute <= 9) minute = "0" + minute;

      let second: string | number = date.getSeconds();
      if (second <= 9) second = "0" + second;

      let hourMinute = `${hour}:${minute}`;

      return `${hourMinute}${hasSeconds ? ":" + second : ""}`;
    }
    return "";
  }
  static stringToDate(dateString: string): Date | undefined {
    let date;
    dateString = dateString.trim();
    if (dateString.indexOf(".") > -1) {
      let arr = dateString.split(".");
      if (arr.length == 3) {
        let hour: number = 0;
        let minute: number = 0;

        if (arr[2] && arr[2].indexOf(":") > -1) {
          let yearAndTime = arr[2].split(" ");
          if (yearAndTime.length == 2) {
            let time = yearAndTime[1];
            let hourMinute = time.split(":");
            if (hourMinute.length > 1) {
              hour = parseInt(hourMinute[0]);
              minute = parseInt(hourMinute[1]);
            }
          }
        }

        let year = parseInt(arr[2]);
        let month = parseInt(arr[1]) - 1;
        let day = parseInt(arr[0]);

        if (month <= 12 && day <= 31 && hour <= 23 && minute <= 59) date = new Date(year, month, day, hour, minute);
      }
    }
    return date;
  }
  static dateFormatToApiDate(dateString: string): string {
    if (this.checkDateStringFormatValidity(dateString)) {
      let date = this.stringToDate(dateString);
      if (date && this.checkDateValidity(date)) return this.dateToApiDate(date);
    }
    return "";
  }
  static checkDateValidity(date: Date) {
    return date && date instanceof Date && !isNaN(date.getTime());
  }
  static checkApiStringValidity(value: string) {
    let regex = new RegExp(
      /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g
    );
    return value && regex.test(value);
  }
  static checkDateStringFormatValidity(value: string) {
    let date = this.stringToDate(value);
    return date && this.checkDateValidity(date);
  }
  static checkTimeStringFormatValidity(value: string) {
    if (!value || value.indexOf(":") == -1) return false;

    return value.split(":").length > 1;
  }

  static now() {
    return new Date();
  }
  static nowApi(onlyDate?: boolean) {
    return this.dateToApiDate(this.now(), onlyDate);
  }
  static dateToApiDate(date: Date, onlyDate?: boolean, hideTimeZone?: boolean): string {
    let dateString = "";
    if (date) {
      let year = date.getFullYear();
      let month: number | string = date.getMonth();
      //month start from 0
      month += 1;
      let day: number | string = date.getDate();
      let hour: number | string = onlyDate ? 0 : date.getHours();
      let minute: number | string = onlyDate ? 0 : date.getMinutes();

      if (month <= 9) month = "0" + month;
      if (day <= 9) day = "0" + day;
      if (hour <= 9) hour = "0" + hour;
      if (minute <= 9) minute = "0" + minute;

      dateString = `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
    return dateString;
  }

  static apiDateToTimeSpan(date: string): string {
    if (!date) return "";
    let dateObj = new Date(date);
    return this.dateToTimeSpan(dateObj);
  }
  static dateToTimeSpan(date: Date): string {
    let timeSpan: string = "";
    if (date) {
      let hour: number | string = date.getHours();
      let minute: number | string = date.getMinutes();
      let second: number | string = date.getSeconds();
      if (hour <= 9) hour = "0" + hour;
      if (minute <= 9) minute = "0" + minute;
      if (second <= 9) second = "0" + second;
      timeSpan = `${hour}:${minute}:${second}`;
    }

    return timeSpan;
  }
  static timeToHourAndMinute(time: string) {
    if (!time) return time;

    let arr = time.split(":");
    if (arr && arr.length == 3) {
      return `${arr[0]}:${arr[1]}`;
    }

    return "";
  }
  static setTimeOfApiDateString(date: string, time: string) {
    let hourMinute = time.split(":");
    if (hourMinute.length > 1) {
      let hour = parseInt(hourMinute[0]);
      let minute = parseInt(hourMinute[1]);
      let dateObj = new Date(date);
      dateObj.setHours(hour);
      dateObj.setMinutes(minute);
      return this.dateToApiDate(dateObj);
    }
  }
  static addDaysToString(dateString: string, days: number): string {
    let date = this.stringToDate(dateString);
    if (!date) return "";
    date.setDate(date.getDate() + days);
    return this.dateFormat(date);
  }

  static addDaysToApiString(dateString: string, days: number): string {
    dateString = dateString;
    let date = new Date(dateString);
    if (date && date instanceof Date && !isNaN(date as any)) {
      date.setDate(date.getDate() + days);
    }
    return this.dateToApiDate(date);
  }

  static addMonthsToApiString(dateString: string, months: number): string {
    dateString = dateString;
    let date = new Date(dateString);
    if (date && date instanceof Date && !isNaN(date as any)) {
      date.setMonth(date.getMonth() + months);
    }
    return this.dateToApiDate(date);
  }

  static addYearsToApiString(dateString: string, years: number): string {
    dateString = dateString;
    let date = new Date(dateString);
    if (date && date instanceof Date && !isNaN(date as any)) {
      date.setFullYear(date.getFullYear() + years);
    }
    return this.dateToApiDate(date);
  }

  static timeBetweenTwoDate(date1: Date, date2: Date): number {
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
    let difference_ms = date2_ms - date1_ms;
    return difference_ms;
  }

  static minutesBetweenTwoDate(date1: Date, date2: Date): number {
    return this.timeBetweenTwoDate(date1, date2) / (1000 * 60);
  }

  static hoursBetweenTwoDate(date1: Date, date2: Date): number {
    return this.minutesBetweenTwoDate(date1, date2) / 60;
  }

  static daysBetweenTwoDate(date1: Date, date2: Date): number {
    let one_day = 1000 * 60 * 60 * 24;
    let difference_ms = this.timeBetweenTwoDate(date1, date2);
    return Math.round(difference_ms / one_day);
  }

  static yearsBetweenTwoDate(date1: Date, date2: Date): number {
    let one_year = 1000 * 60 * 60 * 24 * 365;

    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    let difference_ms = date2_ms - date1_ms;

    return Math.round(difference_ms / one_year);
  }

  static daysBetweenTwoApiDate(dateString1: string, dateString2: string): number {
    let date1 = new Date(dateString1);
    let date2 = new Date(dateString2);

    if (!date1 || !date2) return 0;

    let one_day = 1000 * 60 * 60 * 24;

    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    let difference_ms = date2_ms - date1_ms;

    return Math.round(difference_ms / one_day);
  }

  static daysBetweenTwoStringDate(dateString1: string, dateString2: string): number {
    let date1 = this.stringToDate(dateString1);
    let date2 = this.stringToDate(dateString2);

    if (!date1 || !date2) return 0;

    let one_day = 1000 * 60 * 60 * 24;

    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    let difference_ms = date2_ms - date1_ms;

    return Math.round(difference_ms / one_day);
  }

  static daysTillTodayString(dateString: string): number {
    let date1 = this.stringToDate(dateString);
    if (!date1) return 0;
    let date2 = new Date();
    date2.setHours(0, 0, 0);

    let one_day = 1000 * 60 * 60 * 24;

    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    let difference_ms = date2_ms - date1_ms;

    return Math.round(difference_ms / one_day);
  }
  static howManyTimeAgoFromApiDate(dateString: string): string {
    if (dateString) {
      let date = new Date(dateString);
      if (date) {
        return this.howManyTimeAgo(date);
      }
    }
    return "";
  }
  static howManyTimeAgo(date: Date, dayText: string = "day", hourText = "hour", minuteText = "minute"): string {
    let now = new Date();
    let difference = (date.getTime() - now.getTime()) / (1000 * 60);
    if (difference < 0) {
      return "";
    }
    difference = parseInt(difference.toFixed(2));

    let differenceString = "";
    let differenceHour = Math.floor(difference / 60);
    let differenceMinute = difference % 60;

    if (differenceHour > 24) {
      let differenceDay = Math.floor(differenceHour / 24);
      differenceHour = differenceHour % 24;
      differenceString = `${differenceDay} ${dayText}`;
    }

    if (differenceHour > 0) {
      differenceString += `${differenceHour} ${hourText} `;
    }

    if (differenceMinute > 0) {
      differenceString += `${differenceMinute} ${minuteText}`;
    }

    return differenceString;
  }
  static getMondayOfCurrentWeek(date: Date) {
    let day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day == 0 ? -6 : 1) - day);
  }
  static getSundayOfCurrentWeek(date: Date) {
    let day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day == 0 ? 0 : 7) - day);
  }
  static hoursBetweenTwoStringDate(dateString1: string, dateString2: string) {
    if (!dateString1 || !dateString2) {
      return "-";
    }
    let startDate = new Date(dateString1);
    let planDate = new Date(dateString2);
    let result = Math.floor(this.hoursBetweenTwoDate(startDate, planDate));
    if (result > 0) {
      return result.toString();
    } else {
      return "-";
    }
  }
}
