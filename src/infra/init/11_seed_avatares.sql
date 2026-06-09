-- Script para dar avatar padrão a todos os usuários existentes
-- Execute este script APÓS criar usuários

-- Dar avatar padrão (Guerreiro) a todos os usuários que não têm avatar
INSERT INTO public.usuario_avatares (id_usuario, id_avatar, equipado)
SELECT u.id_usuario, a.id_avatar, true
FROM public.usuarios u
CROSS JOIN public.avatares a
WHERE a.eh_padrao = true
AND NOT EXISTS (
    SELECT 1 FROM public.usuario_avatares ua 
    WHERE ua.id_usuario = u.id_usuario
)
ON CONFLICT (id_usuario, id_avatar) DO UPDATE SET equipado = true;