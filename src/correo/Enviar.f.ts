import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as nodemailer from 'nodemailer';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';


if (!admin.apps.length) {
    admin.initializeApp();
}

const transportador=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'tefaa411@gmail.com',
        pass:'http://7,net0'
    }
});

const endPointExpress=express();
const corsVal=cors({origin:true});
endPointExpress.options('*',corsVal);
endPointExpress.use(corsVal);
endPointExpress.use(express.json);
endPointExpress.use(cookieParser());

endPointExpress.post('*',(req,res)=>{
    try{
    const _email=req.body.email;
    const _titulo=req.body.titulo;
    const _mensaje=req.body.mensaje;

    const emailOpciones={
        from:'Houseind@gmail.com',
        to:_email,
        subject:_titulo,
        html:`<p>${_mensaje}</p>`
    }
    transportador.sendMail(emailOpciones,function(error,info){
        if(error){
            res.send(error);
        }else{
            res.send('El email fue enviado correctamente');
        }
    })
    }  
    catch(error){
    console.log(error)
    res.status(401);
    res.send(error);
    }
})



exports = module.exports = functions.https.onRequest((request, response)=>{
    
    return endPointExpress(request, response);

})