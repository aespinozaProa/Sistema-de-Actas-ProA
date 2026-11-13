import test from "node:test";
import assert from "node:assert/strict";
import {detectPlatform,initInstall} from "../../assets/install.js";

test("la ayuda elige instrucciones para Android, iPhone, iPad y computadora",()=>{
 assert.equal(detectPlatform("Mozilla Android"),"android");
 assert.equal(detectPlatform("Mozilla iPhone"),"ios");
 assert.equal(detectPlatform("Mozilla Macintosh",5),"ios");
 assert.equal(detectPlatform("Mozilla Macintosh",0),"desktop");
 assert.equal(detectPlatform("Mozilla Windows"),"desktop");
});

test("ofrece la instalación disponible y mantiene las instrucciones si se cancela",async()=>{
 const previous={document:globalThis.document,window:globalThis.window,navigator:globalThis.navigator,matchMedia:globalThis.matchMedia};
 const listeners={},clicks={},detail={open:false},button={hidden:true,addEventListener:(name,fn)=>{clicks[name]=fn}},status={textContent:""},already={hidden:true};
 const box={querySelector:()=>detail},elements={"#install-box":box,"#install-native":button,"#install-status":status,"#install-already":already};
 try{
  globalThis.document={querySelector:selector=>elements[selector]};globalThis.window={addEventListener:(name,fn)=>{listeners[name]=fn}};Object.defineProperty(globalThis,"navigator",{value:{userAgent:"Android",maxTouchPoints:5},configurable:true});globalThis.matchMedia=()=>({matches:false});
  initInstall();assert.equal(detail.open,true);assert.equal(button.hidden,true);
  let prevented=false;listeners.beforeinstallprompt({preventDefault:()=>{prevented=true},prompt:async()=>({outcome:"dismissed"})});assert.equal(prevented,true);assert.equal(button.hidden,false);
  await clicks.click();assert.equal(button.hidden,true);assert.match(status.textContent,/más tarde/);
 }finally{globalThis.document=previous.document;globalThis.window=previous.window;Object.defineProperty(globalThis,"navigator",{value:previous.navigator,configurable:true});globalThis.matchMedia=previous.matchMedia}
});
