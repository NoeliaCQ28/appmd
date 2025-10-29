export const handleResponse = (data, message, success = true, code = 200) => {
    return {
        data,
        message,
        success,
        code
    }
}