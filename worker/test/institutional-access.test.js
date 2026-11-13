import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import {institutionalIdentity} from "../src/auth.js";

test("una configuración antigua de acceso público no permite entrar sin identidad",async()=>{
  const origin="https://site.example.test";
  const request=new Request("https://api.example.test/auth/session",{method:"POST",headers:{origin}});
  const response=await worker.fetch(request,{ALLOWED_ORIGIN:origin,PUBLIC_ACCESS:"true"});
  assert.equal(response.status,401);
});

test("acepta los orígenes configurados y rechaza otros",async()=>{
  const env={ALLOWED_ORIGIN:"http://localhost:4173,https://aespinozaproa.github.io"};
  const request=origin=>new Request("https://api.example.test/auth/session",{method:"POST",headers:{origin}});
  assert.equal((await worker.fetch(request("https://aespinozaproa.github.io"),env)).status,401);
  assert.equal((await worker.fetch(request("https://otro.example"),env)).status,403);
});

test("solo acepta identidad de Google Workspace verificada del dominio escolar",()=>{
  const valid={hd:"escuelasproa.edu.ar",email_verified:true,email:"Persona@escuelasproa.edu.ar",sub:"123"};
  assert.equal(institutionalIdentity(valid).email,"persona@escuelasproa.edu.ar");
  for(const invalid of [{...valid,hd:"otra.edu.ar"},{...valid,email_verified:false},{...valid,email:"persona@example.com"},{...valid,sub:""}])assert.throws(()=>institutionalIdentity(invalid));
});
