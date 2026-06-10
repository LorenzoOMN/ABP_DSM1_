// src/infra/carregar-usuario.js
require('dotenv').config();
const { Pool } = require('pg');
const { hashPassword } = require('../shared/utils/password');
const pool = require("../shared/database/db");
const adminConfig = require('../shared/config/admin.config');

async function carregarUsuario() {
    try {
        console.log('🔐 Gerando hash da senha...');
        const senhaHash = hashPassword(adminConfig.senha);
        console.log('✅ Hash gerado com sucesso');

        console.log('📝 Criando/atualizando usuário admin...');

        // 1. Criar/atualizar usuário admin
        const queryUsuario = `
            INSERT INTO public.usuarios (nome, email, cpf, senha, is_admin)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) 
            DO UPDATE SET 
                senha = EXCLUDED.senha,
                nome = EXCLUDED.nome,
                is_admin = EXCLUDED.is_admin
            RETURNING id_usuario;
        `;

        const resultUsuario = await pool.query(queryUsuario, [
            adminConfig.nome,
            adminConfig.email,
            adminConfig.cpf,
            senhaHash,
            adminConfig.is_admin
        ]);

        const idUsuario = resultUsuario.rows[0].id_usuario;
        console.log(`✅ Usuário admin criado/atualizado (ID: ${idUsuario})`);

        // 2. Criar progresso inicial do admin em progresso_desafio
        console.log('📊 Criando progresso inicial do admin...');
        
        const queryProgressoDesafio = `
            INSERT INTO public.progresso_desafio (
                id_usuario,
                modulo_desafio_atual,
                falhas_no_modulo,
                tentativas_gastas_total,
                certificado_liberado
            )
            VALUES ($1, 1, 0, 0, false)
            ON CONFLICT (id_usuario) DO NOTHING;
        `;

        await pool.query(queryProgressoDesafio, [idUsuario]);
        console.log('✅ Progresso de desafio criado');

        // 3. Criar registros iniciais em progresso_historia para os 5 módulos
        console.log('📚 Criando histórico dos módulos...');
        
        const queryProgressoHistoria = `
            INSERT INTO public.progresso_historia (id_usuario, id_modulo, concluido)
            VALUES 
                ($1, 1, false),
                ($1, 2, false),
                ($1, 3, false),
                ($1, 4, false),
                ($1, 5, false)
            ON CONFLICT (id_usuario, id_modulo) DO NOTHING;
        `;

        await pool.query(queryProgressoHistoria, [idUsuario]);
        console.log('✅ Histórico dos 5 módulos criado');

        console.log('\n🎉 Admin configurado com sucesso e pronto para jogar!');
        console.log(` Email: ${adminConfig.email}`);
        console.log(` Senha: ${adminConfig.senha}`);
        console.log(` CPF: ${adminConfig.cpf}`);
        console.log(` Admin: ${adminConfig.is_admin}`);

        await pool.end();
    } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error.message);
        process.exit(1);
    }
}

carregarUsuario();