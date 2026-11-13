import test from "node:test";
import assert from "node:assert/strict";
import {SerialQueue} from "../src/serial-queue.js";

test("ediciones simultáneas se procesan en orden y la versión vieja se rechaza",async()=>{
  const queue=new SerialQueue();let revision="v1",release;const gate=new Promise(resolve=>{release=resolve});const calls=[];
  const update=expected=>queue.run(async()=>{calls.push(expected);if(expected!==revision)throw new Error("conflicto");await gate;revision="v2";return revision});
  const first=update("v1"),second=update("v1");await Promise.resolve();assert.deepEqual(calls,["v1"]);release();assert.equal(await first,"v2");await assert.rejects(second,/conflicto/);assert.deepEqual(calls,["v1","v1"]);
});

test("un fallo no bloquea las operaciones siguientes",async()=>{const queue=new SerialQueue();await assert.rejects(queue.run(async()=>{throw new Error("falló")}));assert.equal(await queue.run(async()=>"continúa"),"continúa")});
