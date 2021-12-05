import { Request, Response } from 'express';
import { RecordModel, RecordSchema } from '../schemas/record';
import { Joi } from 'express-validation';
import { PrescriptionRecordBody } from '../types/recordTypes';
import * as ethService from '../services/ethService';
import { sendError } from '../helpers/errorHelper';
import { HospitalModel } from '../schemas/hospital';
import { HospitalSchema } from '../schemas/hospital';
import { DoctorModel, DoctorSchema } from '../schemas/doctor';

/**
 * addRecord Controller Validator Config
 */

const medicineDoseValidation = Joi.object({
    dose: Joi.number().required(),
    beforeOrAfter: Joi.string().required()
}).required();

const medicineItemsValidation = Joi.object({
    name: Joi.string().required(),
    m: medicineDoseValidation,
    a: medicineDoseValidation,
    n: medicineDoseValidation
})

export const addRecordValidation = {
    body: Joi.object({
         illness: Joi.string().required(),
         patientId: Joi.string().required(),
         doctorId: Joi.string().required(),
         description: Joi.string().required(),
         medicine: Joi.array().items(medicineItemsValidation)
     }),
};

export async function addRecord (req: any, res: any, next: any) {
    try {
        const record: PrescriptionRecordBody = req.body;
        const date = new Date();
        const hospitalId = process.env.HOSPITAL_ID;
        await RecordModel.create({
            data: {
                ...record,
                date,
                hospitalId,
            }
        })
        res.status(201).json({
            data: "Record Created Successfully"
        });
    }
    catch(error) {
        next(error)
    }
}

export const getPatientRecordIdsByPatientIdValidation = {
    body: Joi.object({
         patientId: Joi.string().required()
     }),
};

export async function getPatientRecordIdsByPatientId (req: any, res: any, next: any) {
    try {
        const { patientId } = req.body;
        const recordIds = await ethService.getRecordId(patientId);
        res.json({data: {
            recordIds
        }
        });
    }
    catch(error) {
        next(error)
    }
}

export const getRecordsByPatientIdValidation = {
    body: Joi.object({
         patientId: Joi.string().required()
     }),
};

export async function getRecordsByPatientId (req: any, res: any, next: any) {
    try {
        const { patientId } = req.body;
        const recordIds = await ethService.getRecordId(patientId);
        const recordsLocal: RecordSchema[] = await RecordModel.find({
            _id: recordIds
        });

        const localRecords: string[] = [];
        const responseObj = recordsLocal.map(r => {
        localRecords.push(r._id);
            return ({
                id: r._id,
                ...r.data
            });
        });

        const missingRecords = recordIds.filter(x => !localRecords.includes(x));
        for(const id of missingRecords) {
            const recordString = await ethService.getRecord(id);
            const data = JSON.parse(recordString);
            data.id = id;
            responseObj.push(data);
        }

        responseObj.sort((a, b) => (new Date(b.date).valueOf() - new Date(a.date).valueOf()));
        res.json({
            count: responseObj.length,
            data: await getDoctorHospitalName(responseObj)
        });
    }
    catch(error) {
        next(error);
    }
}

export const getRecordValidation = {
    body: Joi.object({
         id: Joi.string().required()
     }),
};

export async function getRecord (req: any, res: any, next: any) {
    try {
        const { id } = req.body;
        const recordString = await ethService.getRecord(id);
        if(recordString === "") {
            sendError(res, 400, "Record Not Found");
        }
        const data = JSON.parse(recordString);
        data.id = id;

        const doctor: DoctorSchema = await DoctorModel.findById(data.doctorId);
        const hospital: HospitalSchema = await HospitalModel.findById(data.hospitalId);

        let doctorName = '';
        let hospitalName = '';
        if(doctor) {
            doctorName = doctor.name;
        }

        if(hospital) {
            hospitalName = hospital.name;
        }

        data.doctor= doctorName;
        data.hospital= hospitalName;

        res.json({
            data,
        });
    }
    catch(error) {
        next(error);
    }
}


async function getDoctorHospitalName(records: any[]) {
    const hospitalMap: any = {}
    const doctorMap: any = {}
    for(const r of records) {
        let hospitalName = "";
        let doctorName = "";
        if(hospitalMap[r.hospitalId]) {
            hospitalName = hospitalMap[r.hospitalId];
        }
        else {
            const hospital: HospitalSchema= await HospitalModel.findById(r.hospitalId);
            if(hospital)
                hospitalName = hospital.name;
        }
        if(doctorMap[r.doctorId]) {
            doctorName = doctorMap[r.doctorId];
        }
        else {
            const doctor: DoctorSchema= await DoctorModel.findById(r.doctorId);
            if(doctor)
                doctorName = doctor.name;
        }
        r.hospital = hospitalName;
        r.doctor = doctorName;
    }
    return records;
}