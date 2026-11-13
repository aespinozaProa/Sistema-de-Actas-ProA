import test from "node:test";
import assert from "node:assert/strict";
import {issueSession,verifySession} from "../src/auth.js";
import {logLogin,allRecords} from "../src/records.js";
import {RECORD_LABELS} from "../src/sheets.js";

test("la sesión firmada mantiene la identidad y rechaza una clave diferente",async()=>{
 const env={SESSION_SECRET:"a".repeat(32)},identity={email:"docente@escuelasproa.edu.ar",name:"Docente",sub:"123"};
 const token=await issueSession(identity,env);
 assert.deepEqual(await verifySession(token,env),identity);
 await assert.rejects(verifySession(token,{SESSION_SECRET:"b".repeat(32)}));
 await assert.rejects(verifySession(token,{SESSION_SECRET:"corta"}));
});

test("el ingreso se registra sin aparecer como acta",async()=>{
 const original=globalThis.fetch,rows=[RECORD_LABELS];
 globalThis.fetch=async(_url,options)=>{const data=JSON.parse(options.body);if(data.action==="append")rows.push(data.values);return Response.json({ok:true,values:rows})};
 try{const env={APPS_SCRIPT_URL:"https://example.test",APPS_SCRIPT_SECRET:"x".repeat(32)};await logLogin(env,{email:"docente@escuelasproa.edu.ar",name:"Docente"});assert.equal(rows.length,2);assert.equal(rows[1][17],"ingreso");assert.deepEqual(await allRecords(env),[])}finally{globalThis.fetch=original}
});
