
export default (error) => {
  let errorFormat = {
    code: error.code,
    message: error.msg,
    field: error.param,
    status: error.status
  }
  return errorFormat
}
