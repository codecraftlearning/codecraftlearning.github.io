import { CertificationType } from "../constants/commons.enum";

export interface ICertificate {
    id: string;
    issuedTo: string;
    courseTitle: string;
    technologiesCovered: string; // Array of technologies covered in the course
    duration: string;
    completionDate: string;
    certifiedBy: string; 
    modeOfLearning: string;
    certificationType: CertificationType;
    IssuedUnder: string; // The entity that issued the certificate
}