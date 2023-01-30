import mongoose, { Model, Schema } from 'mongoose';
import { Entry } from '../interfaces/entry';

// Creo la interfaz para pasarsela al Model, y al extender la de interfaces traigo las mismas propiedades
export interface IEntry extends Entry {}

const entrySchema = new Schema({
  description: { type: String, required: true },
  createdAt: { type: Number},
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'finished'],
      messages: '{VALUE} no es un estado permitido.'
    },
    default: 'pending'
  }
});

// Con el || si existe devuelvo el mismo, si no existe lo creo
const EntryModel:Model<IEntry> = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default EntryModel;