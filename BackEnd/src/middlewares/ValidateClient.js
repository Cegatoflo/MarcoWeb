import { clientSchema } from "../schemas/client.schema.js";

export const validateClient = (req, res, next) => {
    clientSchema.validate(req.body, { abortEarly: false })
        .then(() => {
            next();
        })
        .catch((err) => {
            res.status(400).json({
                errors: err.inner.map(e => ({
                    path: e.path,
                    message: e.message
                }))
            });
        });
};