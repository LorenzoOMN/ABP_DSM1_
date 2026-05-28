CREATE TABLE artefatos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao_curta VARCHAR(255),
    conteudo_longo TEXT,
    imagem VARCHAR(255),  -- ← Nome do arquivo (ex: product_backlog.png)
    capitulo_requisito INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COPY public.artefatos (id, titulo, descricao_curta, conteudo_longo, imagem, capitulo_requisito)
FROM '__SEED_DATA_DIR__/artefatos.csv'
DELIMITER ','
CSV HEADER;