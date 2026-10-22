-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoCaso" AS ENUM ('abierto', 'en_curso', 'cerrado');

-- CreateEnum
CREATE TYPE "CondicionEspecial" AS ENUM ('ninguna', 'victima_conflicto', 'desplazado', 'migrante', 'madre_cabeza_familia', 'adulto_mayor', 'otro');

-- CreateEnum
CREATE TYPE "PrioridadCaso" AS ENUM ('baja', 'media', 'alta', 'urgente');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "condicion_especial" "CondicionEspecial" NOT NULL DEFAULT 'ninguna',
    "tiene_prioridad" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "casos" (
    "id" TEXT NOT NULL,
    "numero_expediente" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoCaso" NOT NULL DEFAULT 'abierto',
    "prioridad" "PrioridadCaso" NOT NULL DEFAULT 'media',
    "es_fuerza_mayor" BOOLEAN NOT NULL DEFAULT false,
    "nivel_abogado_exigido" TEXT NOT NULL DEFAULT 'junior',
    "abogado_asignado_id" TEXT,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cliente_id" TEXT NOT NULL,

    CONSTRAINT "casos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caso_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_tipo_documento_numero_documento_key" ON "clientes"("tipo_documento", "numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "casos_numero_expediente_key" ON "casos"("numero_expediente");

-- CreateIndex
CREATE INDEX "casos_cliente_id_idx" ON "casos"("cliente_id");

-- CreateIndex
CREATE INDEX "casos_abogado_asignado_id_idx" ON "casos"("abogado_asignado_id");

-- CreateIndex
CREATE INDEX "documentos_caso_id_idx" ON "documentos"("caso_id");

-- AddForeignKey
ALTER TABLE "casos" ADD CONSTRAINT "casos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "casos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

