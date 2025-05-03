import { Gender } from "../constants/commons.enum";

export interface IStudent {
    id?: string;
    name: string;
    age: number;
    gender: Gender;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}