export function detectPlatform(userAgent,maxTouchPoints=0){if(/android/i.test(userAgent))return "android";if(/iphone|ipad|ipod/i.test(userAgent)||(/macintosh/i.test(userAgent)&&maxTouchPoints>1))return "ios";return "desktop"}

export function initInstall(){
 const dialog=document.querySelector("#install-dialog"),instructions=document.querySelector("#install-instructions"),nativeButton=document.querySelector("#install-native"),status=document.querySelector("#install-status"),already=document.querySelector("#install-already");
 if(!dialog)return;
 const steps={
  android:["Abrí esta página en Chrome o en el navegador de tu teléfono.","Tocá el menú de tres puntos del navegador y elegí «Instalar aplicación» o «Agregar a pantalla principal».","Confirmá la instalación. Encontrarás Actas ProA junto a tus otras aplicaciones."],
  ios:["Abrí esta página en el navegador de tu iPhone o iPad.","Tocá el botón Compartir (el cuadrado con una flecha hacia arriba).","Elegí «Agregar a pantalla de inicio» y después tocá «Agregar». Si no aparece, buscá esa opción al final de la lista."],
  desktop:["Abrí la página en Chrome o Edge.","Buscá el ícono de instalación a la derecha de la barra de direcciones, o abrí el menú del navegador y elegí «Instalar aplicación».","Confirmá la instalación para abrir Actas ProA desde tu escritorio o menú de aplicaciones."]
 };
 let promptEvent=null,platform=detectPlatform(navigator.userAgent,navigator.maxTouchPoints);
 const installed=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
 function render(){document.querySelectorAll("[data-install-platform]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.installPlatform===platform)));instructions.replaceChildren();const title=document.createElement("h3"),list=document.createElement("ol");title.textContent=platform==="android"?"Pasos para Android":platform==="ios"?"Pasos para iPhone o iPad":"Pasos para computadora";for(const step of steps[platform]){const item=document.createElement("li");item.textContent=step;list.append(item)}instructions.append(title,list);already.hidden=!installed();nativeButton.hidden=!promptEvent||installed()||platform!==detectPlatform(navigator.userAgent,navigator.maxTouchPoints);status.textContent=""}
 window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();promptEvent=event;if(dialog.open)render()});
 window.addEventListener("appinstalled",()=>{promptEvent=null;if(dialog.open){render();status.textContent="La aplicación se instaló. Ya podés abrirla desde tu dispositivo."}});
 document.querySelector("#install-help").addEventListener("click",()=>{platform=detectPlatform(navigator.userAgent,navigator.maxTouchPoints);render();dialog.showModal()});
 document.querySelectorAll("[data-install-platform]").forEach(button=>button.addEventListener("click",()=>{platform=button.dataset.installPlatform;render()}));
 nativeButton.addEventListener("click",async()=>{if(!promptEvent)return;const event=promptEvent;promptEvent=null;nativeButton.hidden=true;try{const choice=await event.prompt();status.textContent=choice?.outcome==="accepted"?"Seguí la confirmación del navegador para terminar la instalación.":"Podés instalarla más tarde siguiendo los pasos de arriba."}catch{status.textContent="No se pudo abrir la instalación. Seguí los pasos de arriba."}});
}
