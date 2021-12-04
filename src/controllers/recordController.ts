import { Request, Response } from 'express';
import { RecordModel } from '../schemas/record';
import { Joi } from 'express-validation';
import { PrescriptionRecordBody } from '../types/recordTypes';

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
         description: Joi.string().required(),
         medicine: Joi.array().items(medicineItemsValidation)
     }),
 };

export async function addRecord (req: any, res: any, next: any) {
    try {
        const record: PrescriptionRecordBody = req.body;
        const date = new Date();
        const hospitalId = process.env.HOSPITAL_ID;
        const doctorId = "123";
        await RecordModel.create({
            data: {
                ...record,
                date,
                hospitalId,
                doctorId
            }
        })
        res.status(201).send("Record Created Successfully");
    }
    catch(error) {
        next(error)
    }
}