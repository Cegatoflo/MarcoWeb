import { authSchema } from "../schemas/auth.schema.js";

export const validateAuth=(req,res,next)=>{

    authSchema.validate(req.body,{abortEarly:false})
    .then(()=>{
        next();
    })
    .catch((err)=>{
        res.status(400).json({errors: err.inner.map(e=>({
            path: e.path,
            message: e.message
        }))})
    })
}