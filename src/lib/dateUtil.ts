
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
        if (!dateStr) return '';
        const diffMs = Date.now() - new Date(dateStr).getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'Just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    static toValidDate(createdAt) {
        if (!createdAt) return null;
        const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(createdAt);
        const normalized = hasTz ? createdAt : createdAt + "Z";
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? null : d;
    }
    static formatDate = (isoDate) => new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
