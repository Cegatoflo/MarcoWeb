export const requestLogger = (req, res, next) => {
    const method = req.method
    const url = req.url
    const timestamp = new Date().toISOString()
    const token = req.cookies.token

    console.log(`[${timestamp} ${method} ${url}] TOKEN: ${token}`)
    next()
}