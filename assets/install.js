export function detectPlatform(userAgent,maxTouchPoints=0){if(/android/i.test(userAgent))return "android";if(/iphone|ipad|ipod/i.test(userAgent)||(/macintosh/i.test(userAgent)&&maxTouchPoints>1))return "ios";return "desktop"}

export function initInstall(){
 const box=document.querySelector("#install-box"),button=document.querySelector("#install-native"),status=document.querySelector("#install-status"),already=document.querySelector("#install-already");
 if(!box||!button||!status||!already)return;
 const platform=detectPlatform(navigator.userAgent,navigator.maxTouchPoints),details=box.querySelector(`[data-install-platform="${platform}"]`);
 if(details)details.open=true;
 let promptEvent=null;
 const installed=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
 function render(){already.hidden=!installed();button.hidden=!promptEvent||installed()}
 window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();promptEvent=event;render()});
 window.addEventListener("appinstalled",()=>{promptEvent=null;render();status.textContent="La aplicación se instaló. Ya podés abrirla desde tu dispositivo."});
 button.addEventListener("click",async()=>{if(!promptEvent)return;const event=promptEvent;promptEvent=null;render();try{const choice=await event.prompt();status.textContent=choice?.outcome==="accepted"?"Seguí la confirmación del navegador para terminar la instalación.":"Podés instalarla más tarde siguiendo los pasos de abajo."}catch{status.textContent="No se pudo abrir la instalación. Seguí los pasos de abajo."}});
 render();
}
