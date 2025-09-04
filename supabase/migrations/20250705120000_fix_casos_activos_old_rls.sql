-- Habilitar RLS para la tabla Casos_Activos_old si no está habilitado
ALTER TABLE public."Casos_Activos_old" ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Permitir lectura basada en sucursal de usuario" ON public."Casos_Activos_old";
DROP POLICY IF EXISTS "Permitir inserción basada en sucursal de usuario" ON public."Casos_Activos_old";
DROP POLICY IF EXISTS "Permitir actualización basada en sucursal de usuario" ON public."Casos_Activos_old";
DROP POLICY IF EXISTS "Permitir acceso total a usuarios autenticados" ON public."Casos_Activos_old";

-- Crear una nueva política permisiva para todos los usuarios autenticados
CREATE POLICY "Permitir acceso total a usuarios autenticados"
ON public."Casos_Activos_old"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Informar que la migración ha sido aplicada
SELECT 'La política de seguridad para Casos_Activos_old ha sido actualizada correctamente.';