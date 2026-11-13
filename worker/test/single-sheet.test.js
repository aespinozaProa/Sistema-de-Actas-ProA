import test from "node:test";
import assert from "node:assert/strict";
import {createRecord,allRecords} from "../src/records.js";
import {RECORD_LABELS} from "../src/sheets.js";

test("actas de estudiantes y docentes se guardan y leen de una sola hoja",async()=>{
  const original=globalThis.fetch,rows=[RECORD_LABELS];
  globalThis.fetch=async(_url,options)=>{
    const data=JSON.parse(options.body);
    assert.equal(data.sheet,"Actas");
    if(data.action==="append")rows.push(data.values);
    return Response.json({ok:true,values:rows});
  };
  try{
    const env={APPS_SCRIPT_URL:"https://example.com",APPS_SCRIPT_SECRET:"prueba"},actor={email:"Prueba"};
    await createRecord(env,actor,"student",{fechaHecho:"2026-11-12",curso:"2°",estudiante:"Ana Pérez",mailTutor:"tutor@example.com",motivo:"Reunión",hechos:"Descripción"});
    await createRecord(env,actor,"teacher",{fecha:"2026-11-12",tema:"Equipo",participantes:"Docentes",descripcion:"Reunión",responsable:"Coordinación"});
    const records=await allRecords(env);
    assert.equal(rows.length,3);
    assert.deepEqual(records.map(record=>record.type),["student","teacher"]);
    assert.equal(records[1].tema,"Equipo");
  }finally{globalThis.fetch=original}
});
