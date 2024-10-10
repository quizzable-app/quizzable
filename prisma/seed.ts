import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

if (process.argv[1].endsWith("seed.ts")) {
  seed()
    .catch((e) => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export async function seed() {
  const csv = readFileSync(resolve(__dirname, "seed-data.csv"), "utf-8")
    .split("\n")
    .map((line) =>
      line
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)
        .map((cell) => cell.replace(/["\r]/g, ""))
    );

  const org = await prisma.organization.create({
    data: {
      name: "Coast Community College District",
      canvasRootAccount: "coastdistrict.instructure.com",
    },
  });

  const course = await prisma.course.create({
    data: {
      name: "CS101",
      organizationId: org.id,
      sisCourseId: "CS101",
    },
  });

  const header = csv[0];

  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    const student: any = {};
    for (let j = 0; j < row.length; j++) {
      student[header[j]] = row[j];
    }
    if (student["SIS User ID"]) {
      const [lastName, firstName] = student["Student"].split(", ");
      await prisma.user
        .create({
          data: {
            canvasId: student["ID"],
            email: `${student["SIS Login ID"]}@student.cccd.edu`,
            name: `${firstName} ${lastName}`,
            organizationId: org.id,
            sisLoginId: student["SIS Login ID"],
            sisUserId: student["SIS User ID"],
            Roles: {
              set: ["STUDENT"],
            },
            Sections: {
              connectOrCreate: {
                where: {
                  organizationId_sisSectionId: {
                    organizationId: org.id,
                    sisSectionId: student["Section"],
                  },
                },
                create: {
                  courseId: course.id,
                  name: student["Section"],
                  organizationId: org.id,
                  sisSectionId: student["Section"],
                },
              },
            },
          },
        })
        .catch((e) => {
          console.error("Error creating user", student);
          console.error(e);
          throw new Error("Error creating user");
        });
    }
  }
}
