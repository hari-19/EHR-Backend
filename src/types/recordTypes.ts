export interface PrescriptionRecordBody {
    patientId: string;
    illness: string;
    description: string;
    medicine: Medicine[];
}

export interface PrescriptionRecord {
    date: Date;
    doctorId: string;
    hospitalId: string;
    patientId: string;
    illness: string;
    description: string;
    medicine: Medicine[];
}

export interface Medicine {
    name: string;
    m: MedicineDose;
    a: MedicineDose;
    n: MedicineDose;
}

export interface MedicineDose {
    dose: number;
    beforeOrAfter: string;
}