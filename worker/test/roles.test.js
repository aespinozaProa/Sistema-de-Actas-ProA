import test from "node:test";
import assert from "node:assert/strict";
import {assignRole,isAdmin} from "../src/roles.js";
import {RecordWriter} from "../src/record-writer.js";
import {issueSession} from "../src/auth.js";
import {RECORD_HEADERS,RECORD_LABELS} from "../src/sheets.js";
import worker from "../src/index.js";

test("solo administradores pueden asignar roles y siempre queda uno",()=>{
 const env={ADMIN_EMAILS:"uno@escuelasproa.edu.ar"},uno="uno@escuelasproa.edu.ar",dos="dos@escuelasproa.edu.ar";
 assert.throws(()=>assignRole(dos,dos,"admin",{},env));
 assert.throws(()=>assignRole(uno,uno,"author",{},env));
 const granted=assignRole(uno,dos,"admin",{},env);assert.equal(isAdmin(dos,granted,env),true);
 const handed=assignRole(uno,uno,"author",granted,env);assert.equal(isAdmin(uno,handed,env),false);assert.equal(isAdmin(dos,handed,env),true);
 assert.throws(()=>assignRole(uno,dos,"author",handed,env));
});

test("los cambios de rol exigen inicio previo y se aplican al servidor",async()=>{
 const owner="uno@escuelasproa.edu.ar",candidate="dos@escuelasproa.edu.ar",origin="https://site.example.test",rows=[RECORD_LABELS,RECORD_HEADERS.map(key=>({type:"ingreso",createdBy:candidate,estudiante:"Dos"})[key]||"")];
 const memory=new Map(),storage={get:async key=>memory.get(key),put:async(key,value)=>memory.set(key,value)};
 const env={ADMIN_EMAILS:owner,SESSION_SECRET:"s".repeat(32),ALLOWED_ORIGIN:origin,APPS_SCRIPT_URL:"https://example.test",APPS_SCRIPT_SECRET:"x".repeat(32)};
 const instance=new RecordWriter({storage},env);env.RECORD_WRITER={idFromName:name=>name,get:()=>({fetch:(url,options)=>instance.fetch(new Request(url,options))})};
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({ok:true,values:rows});
 try{
  const token=await issueSession({email:owner,name:"Uno",sub:"1"},env),headers={origin,authorization:`Bearer ${token}`,"content-type":"application/json"};
  const call=(email,role)=>worker.fetch(new Request(`https://api.example.test/users/${encodeURIComponent(email)}`,{method:"PUT",headers,body:JSON.stringify({role})}),env);
  assert.equal((await call("sin-ingreso@escuelasproa.edu.ar","admin")).status,400);
  assert.equal((await call(candidate,"admin")).status,200);
  assert.equal((await call(owner,"author")).status,400);
  const newToken=await issueSession({email:candidate,name:"Dos",sub:"2"},env);
  const session=await worker.fetch(new Request("https://api.example.test/auth/session",{method:"POST",headers:{origin,authorization:`Bearer ${newToken}`}}),env);
  assert.equal((await session.json()).role,"admin");
 }finally{globalThis.fetch=original}
});
