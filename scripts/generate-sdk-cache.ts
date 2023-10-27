import { prisma } from "@/shared/prisma"

async function main() {
  const communities = await prisma.community.findMany({
    select: {
      registry: true,
      name: true,
      chainId: true
    }
  })
  const res: any = {}
  communities.forEach(({ registry, name, chainId }) => {
    res[name] = chainId
  })

  console.log(res)
}

main()