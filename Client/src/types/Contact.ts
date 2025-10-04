export interface Contact {
    name?: string;
    email?: string;
    phoneNumber?: string;
    detail?: string;
}

export interface FeedbackForm {
    id: string | number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
    fbdate?: string;
}