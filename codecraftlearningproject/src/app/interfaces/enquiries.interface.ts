import { EnquiryStatus } from "../constants/commons.enum";

export interface IEnquiry {
    id?: string;
    fullName: string;
    email: string;
    age: string;
    contactNumber: string;
    packageName: string;
    technologies: string[];
    createdDate: Date;
    status?: EnquiryStatus; 
    notes?: string;
}