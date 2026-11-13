import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {values,append} from "../src/sheets.js";

test("el puente rechaza solicitudes sin secreto y guarda texto sin fórmulas",()=>{
  const rows=[];let releases=0;
  const sheet={getLastRow:()=>rows.length,getRange:(_row,_col,_height,_width)=>({getDisplayValues:()=>rows,setNumberFormat(){return this},setValues(values){rows.push(...values)}})};
  const secret="x".repeat(32);
  const context={JSON,ContentService:{MimeType:{JSON:"json"},createTextOutput:value=>({setMimeType:()=>JSON.parse(value)})},PropertiesService:{getScriptProperties:()=>({getProperty:key=>({BRIDGE_SECRET:secret,SPREADSHEET_ID:"id"})[key]})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush(){}},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){releases++}})}};
  runInNewContext(readFileSync(new URL("../../google-apps-script/Code.gs",import.meta.url),"utf8"),context);
  const send=body=>context.doPost({postData:{contents:JSON.stringify(body)}});
  assert.equal(send({secret:"incorrecto",action:"read",sheet:"Actas"}).ok,false);
  assert.equal(send({secret,action:"read",sheet:"USUARIOS"}).ok,false);
  assert.equal(send({secret,action:"append",sheet:"Actas",values:["=IMPORTXML(1)",...Array(22).fill("ejemplo")]}).ok,true);
  assert.equal(rows[0][0],"'=IMPORTXML(1)");
  assert.equal(releases,1);
  assert.equal(send({secret,action:"read",sheet:"Actas"}).values.length,1);
});

test("el Worker usa el puente para leer y agregar filas",async()=>{
  const original=globalThis.fetch,calls=[];
  globalThis.fetch=async(_url,options)=>{calls.push(JSON.parse(options.body));return Response.json({ok:true,values:[["encabezado"],["dato"]]})};
  try{
    const env={APPS_SCRIPT_URL:"https://script.google.com/example",APPS_SCRIPT_SECRET:"secreto"};
    assert.deepEqual(await values(env,"Actas!1:1"),[["encabezado"]]);
    assert.deepEqual(await values(env,"Actas!A:Z"),[["encabezado"],["dato"]]);
    await append(env,"Actas",["x"]);
    assert.deepEqual(calls.map(call=>call.action),["read","read","append"]);
    assert.equal(calls[0].secret,"secreto");
  }finally{globalThis.fetch=original}
});
