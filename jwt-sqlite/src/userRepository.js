import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class User {
    constructor() {
        this.model = prisma.user;
    }

    async create(data) {
        return this.model.create({ data });
    }

    async findAll() {
        return this.model.findMany();
    }

    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }

    async findByEmail(email) {
        return this.model.findUnique({ where: { email } });
    }

    async update(id, data) {
        return this.model.update({ where: { id }, data });
    }

    async delete(id) {
        return this.model.delete({ where: { id } });
    }
}

export default new User();
