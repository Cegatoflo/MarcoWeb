import jsonwebtoken from "jsonwebtoken";
export { SECRET } from '../config.js'

export const authRequired = (req, res, next) => {
    const token = req.cookies;
    
    if (!token) return res.status(401).json({ message: "No token, no Authorization" })

    jsonwebtoken.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token Invalido" })

        console.log(token)
        req.user = user
        console.log(user);

        next()
    })
}