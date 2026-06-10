// src/infra/carregar-usuario.js
require('dotenv').config();
const { Pool } = require('pg');
const { hashPassword } = require('../shared/utils/password');
const pool = require("../shared/database/db");
const adminConfig = require('../shared/config/admin.config'); // ← Importa o arquivo centralizado

async function carregarUsuario() {
    try {
        console.log('🔐 Gerando hash da senha...');

        // Gera o hash usando sua função
        const senhaHash = hashPassword(adminConfig.senha);
        console.log('✅ Hash gerado com sucesso');

        console.log('📝 Criando/atualizando usuário admin...');

        // SQL para inserir ou atualizar o usuário
        const query = `
        INSERT INTO public.usuarios (nome, email, cpf, senha, is_admin)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) 
        DO UPDATE SET 
            senha = EXCLUDED.senha,
            nome = EXCLUDED.nome,
            is_admin = EXCLUDED.is_admin
        RETURNING id_usuario, nome, email, is_admin;
        `;

        const result = await pool.query(query, [
            adminConfig.nome,
            adminConfig.email,
            adminConfig.cpf,
            senhaHash,
            adminConfig.is_admin
        ]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('✅ Usuário criado/atualizado com sucesso!');
            console.log('📊 Dados do usuário:');
            console.log(`   ID: ${user.id_usuario}`);
            console.log(`   Nome: ${user.nome}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Admin: ${user.is_admin}`);
            console.log(`   Senha: ${adminConfig.senha}`);
            console.log('\n🎉 Agora você pode fazer login com essas credenciais!');
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error.message);
        process.exit(1);
    }
}

carregarUsuario();