//A bar is the same as a Review (UI)
export interface IBar {
    key: string;
    title: string;
    question: string;
    category: string;
    musicCategory: string;
    hotness: string;
    dateCreated: string;
    user: IUser;
    reviews: number;
}

//A review is the same as a Comment (UI)
export interface IReview {
    key?: string;
    bar: string;
    text: string;
    user: IUser;
    dateCreated: string;
    votesUp: number;
    votesDown: number;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface IUser {
    uid: string;
    username: string;
}

export interface ValidationResult {
    [key: string]: boolean;
}

export interface Predicate<T> {
    (item: T): boolean;
}
