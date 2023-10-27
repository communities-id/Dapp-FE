-- CreateTable
CREATE TABLE "Relayer" (
    "id" TEXT NOT NULL,
    "srcChain" BIGINT NOT NULL,
    "dstChain" BIGINT NOT NULL,
    "srcAddress" TEXT NOT NULL,
    "dstAddress" TEXT NOT NULL,
    "srcTx" TEXT NOT NULL,
    "dstTx" TEXT NOT NULL,
    "dstErr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relayer_pkey" PRIMARY KEY ("id")
);
