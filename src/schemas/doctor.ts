import * as mongoose from 'mongoose';

export interface DoctorSchema {
    _id: string,
    email_id: string,
    password: string
}

const doctorSchema = new mongoose.Schema<DoctorSchema>({
    _id: String,
    email_id: String,
    password: String
});

export const DoctorModel = mongoose.model<DoctorSchema>('Doctor', doctorSchema);