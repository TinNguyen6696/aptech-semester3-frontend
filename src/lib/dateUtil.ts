
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
    static timeAgo = (dateStr) => {
        const d = DateUtil.toValidDate(dateStr);
        if (!d) return '';
        const diffMs = Date.now() - d.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'Just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        return d.toLocaleDateString();
    };

    static toValidDate(createdAt) {
        if (!createdAt) return null;
        const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(createdAt);
        const normalized = hasTz ? createdAt : createdAt + "Z";
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? null : d;
    }
    static formatDate = (isoDate) => new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // dateStr is a date-only "YYYY-MM-DD" string (e.g. from <input type="date">).
    // Builds the Date from local Y/M/D components so the day boundary is anchored
    // to the user's local timezone, not UTC midnight, before converting to ISO.
    static toStartOfDayISO(dateStr) {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
    }

    static toEndOfDayISO(dateStr) {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
    }
}
