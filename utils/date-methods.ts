import moment from "moment";

class DateMethods {
    parseDayOfMonthYear(date: Date) {
        return moment(date).format("DD of MMMM, YYYY");
    }

    parseDateDayMonthYear(date: Date) {
        return moment(date).format("Do dddd MMMM, YYYY");
    }

    parseDayMonthYear(date: Date) {
        return moment(date).format("DD MMMM, YYYY");
    }

    parseMonthDayYear(date: Date) {
        return moment(date).format("MMMM DD, YYYY");
    }

    parseDayMonthYearNumeric(date: Date) {
        return moment(date).format("DD / MM / YY");
    }

    parseMonthDateYearTime(date: Date) {
        return moment(date).format("MMMM DD, YYYY, h:mmA");
    }

    parseHumanReadable(date: Date) {
        return moment(date).fromNow();
    }

    parseYearMonthDateNumeric(date: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}

export default new DateMethods();
