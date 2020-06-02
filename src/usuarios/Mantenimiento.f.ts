import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';
import {validaExisteToken} from '../seguridad/validaSesion';

if(!admin.apps.length){
    admin.initializeApp();
}

const db = admin.firestore();

const endPointExpress = express();
const corsVal = cors({origin:true});

endPointExpress.options('*',corsVal);
endPointExpress.use(corsVal);
endPointExpress.use(cookieParser());

const roles  = ["ADMIN", "OPERADOR"];
endPointExpress.use(validaExisteToken(roles));


endPointExpress.post('*', async (req: any, res: any)=>{
    try {
        const _id=req.body.id;
        const _role=req.body.role;
        const _roles=req.body.roles;

        await admin.auth().setCustomUserClaims(_id,_role);

        await db.collection('users').doc(_id).set({roles:_roles},{merge:true})

        res.status(200)
        res.send({status:'success'})

    } catch (error) {
        res.status(403)
        res.send({status:'error',mensaje:error.message})
    }
})
exports = module.exports = functions.https.onRequest((request, response)=>{
    return endPointExpress(request, response);
})