import { Entry, IEntry } from "@/models";
import { isValidObjectId } from "mongoose"
import { db } from "./";

export const getEntryById = async(id:string):Promise<IEntry | null> => {
  
  if(!isValidObjectId) return null;

  await db.connect();
  const entry = Entry.findById(id).lean();
  await db.disconnect();

  // Se hace la seriazliacion para que lea correctamente el ID de mongo ObjectId('3434343434')
  // return JSON.parse(JSON.stringify(entry));
  // return {...entry, id: entry.id.toString()};
  return entry;

}