import * as admin from 'firebase-admin';

if(!admin.apps.length){
    admin.initializeApp();
}

export function validaExisteToken(tokenRoles : any) {
    return async function(req : any, res: any, next : any){
        const {authorization} = req.headers;

        if(!authorization){
            res.status(200);
            res.send({status:"error", mensaje:"no tiene token"})
            return;
        }

        if(!authorization.startsWith('Bearer ')){
            res.status(200);
            res.send({status:"error", mensaje:"no existe token"})
            return;
        }

        try{
            const split = authorization.split('Bearer ')
            if(split.length !== 2){
                res.status(200);
                res.send({status:"error", mensaje:"no tiene token en este modulo"})
                return;
            }

            const token = split[1];
            const tokenDecodificado = await admin.auth().verifyIdToken(token);
            let statusRequest = false;
            tokenRoles.map((role:string)=>{
                if(tokenDecodificado[role] === true){
                    statusRequest = true;
                }
            })

            if(!statusRequest){
                res.status(200);
                res.send({status:"error", mensaje:"no tiene permisos para realizar est acción"})
                return;
            }

            req.user = tokenDecodificado;
            next();
            return;
        }catch(e){
            res.status(200);
            res.send({status:"error", mensaje:"errores decodificando"})
            return;
        }
    }
}