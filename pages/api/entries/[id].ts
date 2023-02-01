import { db } from '@/database';
import { Entry, IEntry } from '@/models';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
  | { message: string }
  | IEntry;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  const { id } = req.query;
  if(!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'El ID no es válido ' + id });
  }
  
  switch (req.method) {
    case 'GET':
      return getEntry(req, res);   
    case 'PUT':
      return updateEntry(req, res);
    case 'DELETE':
      return removeEntry(req, res);
    default:
      return res.status(400).json({ message: 'Método no existe. ' });
  }
  
}

const updateEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { id } = req.query;
  
  await db.connect();

  const entryToUpdate = await Entry.findById(id);

  if(!entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
  }

  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;

  try {
    const updateEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true });
    await db.disconnect();
    res.status(200).json(updateEntry!);
  } catch (error:any) {
    await db.disconnect();
    res.status(400).json({ message: error.errors.status.message });
  }

}

const getEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { id } = req.query;
  
  await db.connect();
  const entry = await Entry.findById(id);
  await db.disconnect();

  if(!entry) {
    return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
  }

  res.status(200).json(entry);

}

const removeEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  
  await db.connect();

  try {
    const removeEntry = await Entry.findByIdAndRemove(id);
    await db.disconnect();
    res.status(200).json(removeEntry!);
  } catch (error:any) {
    await db.disconnect();
    res.status(400).json({ message: error.errors.status.message });
  }
}