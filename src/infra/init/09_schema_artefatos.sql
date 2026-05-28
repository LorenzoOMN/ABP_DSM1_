CREATE TABLE IF NOT EXISTS public.artefatos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao_curta VARCHAR(255),
    conteudo_longo TEXT,
    imagem_url VARCHAR(255),
    capitulo_requisito INT NOT NULL, -- Ex: 1 = precisa completar o módulo 1
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);