import * as mongoose from 'mongoose';
import { ConfigModel } from "./config";
import { v4 as uuidv4 } from "uuid";
import * as encryptionService from "../services/encryptionService";
import * as recordService from "../services/recordService";
import { PrescriptionRecord } from '../types/recordTypes';
export interface RecordSchema {
    _id: string,
    data: PrescriptionRecord,
    key: string
}

const recordSchema = new mongoose.Schema<RecordSchema>({
    _id: String,
    data: Object,
    key: String
});

recordSchema.pre("save", function(next) {
    const doc = this;
    ConfigModel.findByIdAndUpdate(0, {$inc: {recordSl: 1}}, {new: true, upsert: true}, (err, config) => {
        if(err) {
            next(err);
        }
        doc._id = config.hospitalId + "-" + ( "0000000" +config.recordSl).slice(-8);
        doc.key = encryptionService.generateEncryptionKeySymmetric();
        next();
    });
})

recordSchema.post("save", function(this: any, next: any) {
    const doc = this;
    recordService.encryptAndSaveToEth(doc);
})

export const RecordModel = mongoose.model<RecordSchema>('Records', recordSchema);