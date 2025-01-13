import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import faker from 'faker'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        emailVerified: faker.date.past(),
      },
    })

    // Create projects for each user
    for (let j = 0; j < faker.datatype.number({ min: 1, max: 5 }); j++) {
      await prisma.project.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          type: faker.random.arrayElement(['image', 'video', 'text']),
          imageUrl: faker.image.imageUrl(),
          metadata: {
            createdAt: faker.date.past(),
            lastModified: faker.date.recent(),
            tags: faker.random.words(3).split(' '),
          },
          userId: user.id,
        },
      })
    }
  }

  console.log('Staging database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

