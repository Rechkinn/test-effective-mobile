import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { RegisterDto, LoginDto } from "./user.dto";
import { prisma } from "../../config/prisma";

// Поля, которые безопасно возвращать (без пароля)
const safeUserFields = {
  id: true,
  fullName: true,
  birthDate: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const registerUser = async (dto: RegisterDto) => {
  const existing = await prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (existing) throw ApiError.badRequest("Email already in use");

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: dto.fullName,
      birthDate: new Date(dto.birthDate),
      email: dto.email,
      password: hashedPassword,
      role: (dto.role as Role) || Role.user,
    },
    select: safeUserFields,
  });

  return user;
};

export const loginUser = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw ApiError.unauthorized("Invalid credentials");
  if (!user.isActive) throw ApiError.forbidden("Account is blocked");

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
  );

  return { token, user: { ...user, password: undefined } };
};

export const getUserById = async (
  requesterId: string,
  requesterRole: string,
  targetId: string,
) => {
  // Доступ: сам пользователь или админ
  if (requesterRole !== "admin" && requesterId !== targetId) {
    throw ApiError.forbidden("Access denied");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: safeUserFields,
  });

  if (!user) throw ApiError.notFound("User not found");
  return user;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ select: safeUserFields });
};

export const blockUser = async (
  requesterId: string,
  requesterRole: string,
  targetId: string,
) => {
  // Доступ: сам пользователь или админ
  if (requesterRole !== "admin" && requesterId !== targetId) {
    throw ApiError.forbidden("Access denied");
  }

  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) throw ApiError.notFound("User not found");

  return prisma.user.update({
    where: { id: targetId },
    data: { isActive: false },
    select: safeUserFields,
  });
};
