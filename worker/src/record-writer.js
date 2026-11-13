import {updateRecord} from "./records.js";
import {SerialQueue} from "./serial-queue.js";
import {assignRole} from "./roles.js";

// Una sola instancia por planilla serializa la lectura de versión y la escritura.
export class RecordWriter {
  constructor(state,env){this.env=env;this.storage=state.storage;this.queue=new SerialQueue()}
  fetch(request){return this.queue.run(async()=>{try{const url=new URL(request.url);if(url.pathname==="/roles"){const roles=await this.storage.get("roles")||{};if(request.method==="GET")return Response.json({roles});const {actorEmail,targetEmail,role}=await request.json();const next=assignRole(actorEmail,targetEmail,role,roles,this.env);await this.storage.put("roles",next);return Response.json({ok:true})}const {actor,id,data,status}=await request.json();return Response.json(await updateRecord(this.env,actor,id,data,status))}catch(cause){const status=Number.isInteger(cause.code)?cause.code:500;return Response.json({message:status===500?"No se pudo completar la operación.":cause.message},{status})}})}
}
