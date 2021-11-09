import * as mongoose from 'mongoose';
import { ConfigModel } from "./config";

export interface RecordSchema {
    _id: string,
    // tslint:disable-next-line: ban-types
    data: Object,
}

const recordSchema = new mongoose.Schema<RecordSchema>({
    _id: String,
    data: Object
});

recordSchema.pre("save", function(next) {
    const doc = this;
    ConfigModel.findByIdAndUpdate(0, {$inc: {recordSl: 1}}, {new: true, upsert: true}, (err, config) => {
        if(err) {
            next(err);
        }
        doc._id = config.hospitalId + "-" + ( "0000000" +config.recordSl).slice(-8);
        next();
    });
})

export const RecordModel = mongoose.model<RecordSchema>('Records', recordSchema);