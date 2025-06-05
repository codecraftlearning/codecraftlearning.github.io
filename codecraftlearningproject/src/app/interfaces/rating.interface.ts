export interface Rating {
    studentId: string,
    emailId: string,
    name: string;
    courseTitle: string;
    rating: 0 | 1 | 2 | 3 | 4 | 5;
    message: string;
    date: Date;
    gender: 'Male' | 'Female' | 'Other';
}