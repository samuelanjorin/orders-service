import Bcrypt from 'bcryptjs'

export const hashPassword = (password) => {
  const salt = Bcrypt.genSaltSync(1)
  return Bcrypt.hashSync(password, salt)
}

export const removePassword = ({ password, ...rest }) => {
  return rest
}

export const comparePassword = (password, dbPassword) => {
  return Bcrypt.compareSync(password, dbPassword)
}
