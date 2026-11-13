import {updateRecord} from "./records.js";
import {SerialQueue} from "./serial-queue.js";

// Una sola instancia por planilla serializa la lectura de versión y la escritura.
export class RecordWriter {
  constructor(state,env){this.env=env;this.queue=new SerialQueue()}
  fetch(request){return this.queue.run(async()=>{try{const {actor,id,data,status}=await request.json();return Response.json(await updateRecord(this.env,actor,id,data,status))}catch(cause){const status=Number.isInteger(cause.code)?cause.code:500;return Response.json({message:status===500?"No se pudo actualizar el acta.":cause.message},{status})}})}
}
