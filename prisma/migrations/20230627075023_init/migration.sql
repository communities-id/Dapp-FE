-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "chainId" BIGINT NOT NULL,
    "registry" TEXT,
    "from" TEXT,
    "to" TEXT,
    "tokenId" BIGINT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockTimestamp" BIGINT NOT NULL,
    "transactionHash" TEXT,
    "price" BIGINT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "chainId" BIGINT NOT NULL,
    "registry" TEXT,
    "coinId" TEXT,
    "pool" DECIMAL(65,30) DEFAULT 0,
    "from" TEXT,
    "to" TEXT,
    "tokenId" BIGINT NOT NULL,
    "blockNumber" BIGINT,
    "blockTimestamp" BIGINT,
    "transactionHash" TEXT,
    "price" BIGINT,
    "latestBlock" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coin" (
    "id" TEXT NOT NULL,
    "chainId" BIGINT NOT NULL,
    "contract" TEXT,
    "decimals" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cache" (
    "id" TEXT NOT NULL,
    "chainId" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_registry_tokenId_chainId_key" ON "Member"("registry", "tokenId", "chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Community_tokenId_chainId_key" ON "Community"("tokenId", "chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_contract_chainId_key" ON "Coin"("contract", "chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Cache_chainId_type_key" ON "Cache"("chainId", "type");

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
