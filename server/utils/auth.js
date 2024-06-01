import jwt from 'jsonwebtoken';

const secret = '5ecret5odaFountain';
const expiration = '2h';

export const signToken = ({ email, username, _id }) => {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
