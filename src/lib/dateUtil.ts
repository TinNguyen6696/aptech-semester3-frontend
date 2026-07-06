
export default class DateUtil{
    static formatMonthDayYear(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
}