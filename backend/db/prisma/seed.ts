import prisma from "../../src/prisma/client";
import bcrypt from "bcrypt";

async function main() {
  const adminEmail = "GBadmin";
  const adminPassword = "Gators123";

  const exists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!exists) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        isAdmin: true,
      },
    });
    console.log("Admin account created:", adminEmail);
  } else {
    console.log("Admin already exists.");
  }
}

main().catch((e) => console.error(e));
