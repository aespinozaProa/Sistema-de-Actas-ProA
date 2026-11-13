export function baseAdmins(env){return (env.ADMIN_EMAILS||"").split(",").map(email=>email.trim().toLowerCase()).filter(Boolean)}
export function isAdmin(email,overrides,env){return Object.hasOwn(overrides,email)?overrides[email]===true:baseAdmins(env).includes(email)}
export function assignRole(actorEmail,targetEmail,role,overrides,env){
 if(!isAdmin(actorEmail,overrides,env))throw Object.assign(new Error("Solo una persona administradora puede cambiar roles."),{code:403});
 if(!/^[^\s@]+@escuelasproa\.edu\.ar$/.test(targetEmail)||!["admin","author"].includes(role))throw Object.assign(new Error("Cuenta o rol inválido."),{code:400});
 const next={...overrides,[targetEmail]:role==="admin"},known=new Set([...baseAdmins(env),...Object.keys(next)]);
 if(![...known].some(email=>isAdmin(email,next,env)))throw Object.assign(new Error("Debe quedar al menos una persona administradora."),{code:400});
 return next;
}
