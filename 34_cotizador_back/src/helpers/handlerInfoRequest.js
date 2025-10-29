export const handlerInfoRequest = (req) => {
    const { ip } = req
    const device = req.headers['user-agent']

    return { ip, device }
}