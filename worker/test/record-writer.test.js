import test from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync} from "node:crypto";
import {RecordWriter} from "../src/record-writer.js";
import {RECORD_HEADERS,RECORD_LABELS} from "../src/sheets.js";

test("dos ediciones de la misma revisión no crean versiones paralelas",async()=>{
  const {privateKey}=generateKeyPairSync("rsa",{modulusLength:2048,privateKeyEncoding:{type:"pkcs8",format:"pem"},publicKeyEncoding:{type:"spki",format:"pem"}});
  const env={GOOGLE_PRIVATE_KEY:privateKey,GOOGLE_SERVICE_ACCOUNT_EMAIL:"prueba@example.com",SPREADSHEET_ID:"prueba"};
  const actor={email:"docente@escuelasproa.edu.ar",role:"author"};
  const data={fechaHecho:"2026-11-12",curso:"1°",estudiante:"Ana Pérez",mailTutor:"tutor@example.com",motivo:"Reunión",hechos:"Descripción",intervenciones:"Sin intervenciones",acuerdos:"Seguimiento",baseRevisionId:"revision-1"};
  const initial={...data,type:"student",recordId:"acta-1",revisionId:"revision-1",version:"1",status:"active",createdBy:actor.email};
  const sheets={Actas:[RECORD_LABELS,RECORD_HEADERS.map(key=>initial[key]||"")]};
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async(input,options={})=>{
    const url=String(input);
    if(url.startsWith("https://oauth2.googleapis.com/"))return Response.json({access_token:"prueba"});
    const match=decodeURIComponent(url).match(/\/values\/(Actas)!([^?]+)/);
    assert.ok(match,`Solicitud inesperada: ${url}`);
    const rows=sheets[match[1]];
    if(options.method==="POST"){await new Promise(resolve=>setTimeout(resolve,20));rows.push(JSON.parse(options.body).values[0]);return Response.json({})}
    return Response.json({values:match[2]==="1:1"?[rows[0]]:rows});
  };
  try{
    const writer=new RecordWriter({},env);
    const request=()=>new Request("https://writer.internal/",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({actor,id:"acta-1",data})});
    const responses=await Promise.all([writer.fetch(request()),writer.fetch(request())]);
    assert.deepEqual(responses.map(response=>response.status),[200,409]);
    assert.equal(sheets.Actas.length,3);
  }finally{globalThis.fetch=originalFetch}
});
