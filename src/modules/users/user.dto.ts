export interface RegisterDto {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface LoginDto {
  email: string;
  password: string;
}

// Валидация регистрации
export function validateRegister(body: Record<string, unknown>): string | null {
  if (!body.fullName || typeof body.fullName !== "string")
    return "fullName is required";
  if (!body.birthDate || typeof body.birthDate !== "string")
    return "birthDate is required";
  if (isNaN(Date.parse(body.birthDate)))
    return "birthDate must be a valid date (YYYY-MM-DD)";
  if (!body.email || typeof body.email !== "string") return "email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "email is invalid";
  if (!body.password || typeof body.password !== "string")
    return "password is required";
  if ((body.password as string).length < 6)
    return "password must be at least 6 characters";
  return null;
}

// Валидация логина
export function validateLogin(body: Record<string, unknown>): string | null {
  if (!body.email || typeof body.email !== "string") return "email is required";
  if (!body.password || typeof body.password !== "string")
    return "password is required";
  return null;
}
