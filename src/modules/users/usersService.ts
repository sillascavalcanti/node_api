import { PrismaClient } from "@prisma/client";
import { UserModeles } from "./usersModules";
import { UserDTO } from "./dtos/userDTO";
import { NotFoundExeception } from "@exceptions/notFoundException";
import { BadRequestException } from "@exceptions/badRequestException";

const prisma = new PrismaClient();

export const getUsers = async (): Promise<UserModeles[]> => {
    const user = await prisma.user.findMany();

    if (user?.length == 0) {
        throw new NotFoundExeception("user");
    }

    return user;
};

export const getUserByCpf = async (cpf: string): Promise<UserModeles> => {
    const user = await prisma.user.findUnique({ where: { cpf } });

    if (!user) {
        throw new NotFoundExeception("User");
    }

    return user;
};

export const getUserByEmail = async (email: string): Promise<UserModeles> => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new NotFoundExeception("User");
    }

    return user;
};

export const getUsersById = async (id: number): Promise<UserModeles> => {
    console.log("sevice id", id);
    const user = await prisma.user.findFirst({ where: { id } });

    if (user == null) {
        throw new NotFoundExeception("user");
    }

    return user;
};

export const addUser = async (body: UserDTO): Promise<UserModeles> => {
    const checkEmail = await getUserByEmail(body.email).catch(() => undefined);
    if (checkEmail) {
        throw new BadRequestException("Email alredy exist");
    }

    const checkCpf = await getUserByCpf(body.cpf).catch(() => undefined);
    if (checkCpf) {
        throw new BadRequestException("Cpf alredy exist");
    }

    return prisma.user.create({
        data: body,
    });
};

export const deletUser = async (body: UserDTO) => {
    return prisma.user.delete({ where: body });
};
