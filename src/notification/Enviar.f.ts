import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
// import * as path from 'path';

if(!admin.apps.length){
    admin.initializeApp();
}

const messaging = admin.messaging();

const endPointExpress = express();
const corsVal = cors({origin:true});
endPointExpress.options('*',corsVal);
endPointExpress.use(corsVal);
endPointExpress.use(cookieParser());

// endPointExpress.get("/firebase-messaging-sw.js", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "public", "firebase-messaging-sw.js"));
//   });
// endPointExpress.get("*", function response(req, res) {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
//   });

endPointExpress.post('*', async (req, res) =>{

    try{
        const _notificationToken = req.body.token;
        const options = {
            priority : 'high',
            timeTolive: 60*60*24
        }

        const payload = {
            notification : {
                title : "Saludos de Houseind",
                body: "¡Publica tus inmuebles para que otros usuarios los vean!"
            },
            data:{
                adicionalVaxi : "Este es un contenido extra",
                adicionalDrez : "Este es otro contenido extra para la notification"
            }
        }

        if(_notificationToken && _notificationToken.length > 0){
            const respuesta = await messaging.sendToDevice(_notificationToken, payload, options);
            res.status(200);
            res.send({status:"success", mensaje:"la notification se envio correctamente", detalle: respuesta})
            // res.writeHead(201, {
            //     'Content-Type': 'application/javascript'
            // });
        }else{
            res.status(200);
            res.send({status:"success",mensaje:"Este usuario  no tiene token"})
            // res.writeHead(201, {
            //     'Content-Type': 'application/javascript'
            // });
        }

    }catch(e){
        res.status(401);
        res.send(e);
    }

})


exports = module.exports = functions.https.onRequest((request, response) =>{
    return endPointExpress(request, response);
})