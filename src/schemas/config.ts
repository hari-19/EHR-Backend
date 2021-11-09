import * as mongoose from 'mongoose';

export interface ConfigSchema {
    _id: number,
    hospitalId: string,
    recordSl: number,
}

const configSchema = new mongoose.Schema<ConfigSchema>({
    _id: Number,
    hospitalId: String,
    recordSl: Number
});

export const ConfigModel = mongoose.model<ConfigSchema>('Config', configSchema);