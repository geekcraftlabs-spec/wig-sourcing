-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "staff" TEXT,
    "whatsapp" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceEntry" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "hairType" TEXT NOT NULL,
    "laceType" TEXT NOT NULL,
    "texture" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "colorCode" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "bulkPrice" INTEGER,
    "bulkQuantity" INTEGER,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceEntry_shopId_idx" ON "PriceEntry"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceEntry_shopId_hairType_laceType_texture_size_colorCode_key" ON "PriceEntry"("shopId", "hairType", "laceType", "texture", "size", "colorCode");

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
