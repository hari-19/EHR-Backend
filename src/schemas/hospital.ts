import * as mongoose from 'mongoose';

export interface HospitalSchema {
    _id: string,
    name: string,
    url: string
}

const hospitalSchema = new mongoose.Schema<HospitalSchema>({
    _id: String,
    name: String,
    url: String
});

export const HospitalModel = mongoose.model<HospitalSchema>('Hospital', hospitalSchema);