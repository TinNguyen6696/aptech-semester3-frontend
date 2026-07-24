export interface Notification {
    id: number;
    content: string;
    referenceType: string;
    referenceId: number;
    isRead: boolean;
    createdAt: string;
}