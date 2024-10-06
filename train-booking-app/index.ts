import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function index() {
    console.log('hii');
    
    await prisma.user.create({
        data: {
            name: 'Rich',
            email: 'hello@prisma.com',
            posts: {
                create: {
                    title: 'My first post',
                    body: 'Lots of really interesting stuff',
                    slug: 'my-first-post',
                },
            },
        },
    })
}

index()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })