import bycrypt from "bcrypt";

export const hash = ({ plainTixt, salt = process.env.BCRYPT_SALT }) => {
  return bycrypt.hashSync(plainTixt, Number(salt));
};

export const compare = ({ plainTixt, password }) => {
  return bycrypt.compareSync(plainTixt, password);
};
