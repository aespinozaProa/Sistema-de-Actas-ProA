import test from "node:test";
import assert from "node:assert/strict";
import {detectPlatform} from "../../assets/install.js";

test("la ayuda elige instrucciones para Android, iPhone, iPad y computadora",()=>{
 assert.equal(detectPlatform("Mozilla Android"),"android");
 assert.equal(detectPlatform("Mozilla iPhone"),"ios");
 assert.equal(detectPlatform("Mozilla Macintosh",5),"ios");
 assert.equal(detectPlatform("Mozilla Macintosh",0),"desktop");
 assert.equal(detectPlatform("Mozilla Windows"),"desktop");
});
