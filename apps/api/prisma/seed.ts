import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { vmCreateSchema, type VmCreateInput, type UserRole } from "@vm/shared";

const prisma = new PrismaClient();

const users: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}[] = [
  {
    email: "admin@ifx.test",
    name: "Ana Admin",
    password: "Admin123!",
    role: "ADMIN",
  },
  {
    email: "cliente@ifx.test",
    name: "Carlos Cliente",
    password: "Cliente123!",
    role: "CLIENT",
  },
];

const vms: VmCreateInput[] = [
  {
    name: "web-01",
    cores: 2,
    ramGb: 4,
    diskGb: 50,
    os: "UBUNTU_24_04",
    status: "RUNNING",
  },
  {
    name: "web-02",
    cores: 2,
    ramGb: 4,
    diskGb: 50,
    os: "UBUNTU_24_04",
    status: "RUNNING",
  },
  {
    name: "db-primary",
    cores: 8,
    ramGb: 32,
    diskGb: 500,
    os: "DEBIAN_12",
    status: "RUNNING",
  },
  {
    name: "db-replica",
    cores: 8,
    ramGb: 32,
    diskGb: 500,
    os: "DEBIAN_12",
    status: "STOPPED",
  },
  {
    name: "cache-redis",
    cores: 2,
    ramGb: 8,
    diskGb: 20,
    os: "ROCKY_9",
    status: "RUNNING",
  },
  {
    name: "ci-runner",
    cores: 4,
    ramGb: 16,
    diskGb: 200,
    os: "UBUNTU_24_04",
    status: "STOPPED",
  },
  {
    name: "win-ad-01",
    cores: 4,
    ramGb: 16,
    diskGb: 120,
    os: "WINDOWS_SERVER_2022",
    status: "RUNNING",
  },
  {
    name: "analytics-etl",
    cores: 16,
    ramGb: 64,
    diskGb: 1000,
    os: "ROCKY_9",
    status: "STOPPED",
  },
];

async function main() {
  await prisma.vm.deleteMany();
  await prisma.user.deleteMany();

  for (const u of users) {
    await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: await bcrypt.hash(u.password, 10),
      },
    });
  }

  for (const vm of vms) {
    await prisma.vm.create({ data: vmCreateSchema.parse(vm) });
  }

  console.log(`Seed listo: ${users.length} usuarios, ${vms.length} VMs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
