import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET||
  "96791ade244b784a6408a564f9fac045d2f116ae447268d12f5df92aa7244c53931a00032e996becadab71e44ff63444510c497aa84ff8f96d63e076bc3dde07";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables");
}

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error("Invalid or expired token");
  }
};
