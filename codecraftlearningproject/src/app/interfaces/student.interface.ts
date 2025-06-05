import { CertificationStatus, CertificationType, CourseStatus, Gender } from "../constants/commons.enum";

export interface IStudent {
    id?: string;
    name: string;
    age?: number;
    gender?: Gender;
    contact: IStudentContact;
    address?: IStudentAddress;
    course: IStudentCourse;
}

export interface IStudentCourse {
    name: string;
    batchName?: string;
    defaultDuration?: string;
    enrollmentDate?: Date;
    completionDate?: Date;
    technology: string[];
    price?: number;
    instructor?: string;
    status?: CourseStatus;
    certification?: IStudentCertification;
}

export interface IStudentCertification {
    certificationStatus: CertificationStatus;
    certificationDate?: Date;
    certificateId?: string; 
    certificationType?: CertificationType;
}

export interface IStudentAddress {
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

export interface IStudentContact {
    email: string;
    phone: string;
    alternatePhone?: string;
}

