import * as mongoose from 'mongoose';

export interface PatientSchema {
    _id: string,
    name: string,
    ethPublicKey: string,
    contactNumber: string,
    dob: Date,
    emailId: string,
    address: string,
    password: string
}

const patientSchema = new mongoose.Schema<PatientSchema>({
    _id: String,
    name: String,
    dob: mongoose.Schema.Types.Date,
    ethPublicKey: String,
    contactNumber: String,
    emailId: String,
    address: String,
    password: String
});

export const PatientModel = mongoose.model<PatientSchema>('Patient', patientSchema);