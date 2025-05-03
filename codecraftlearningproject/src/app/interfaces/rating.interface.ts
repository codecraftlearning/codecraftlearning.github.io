export interface Rating {
    name: string;
    courseTitle: string;
    rating: 0 | 1 | 2 | 3 | 4 | 5;
    review: string;
    date: Date;
    image: string;
}