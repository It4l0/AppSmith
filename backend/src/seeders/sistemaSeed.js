const Sistema = require('../models/sistema');

async function seedSistemas() {
  try {
    // Verificar se já existem sistemas cadastrados
    const sistemasExistentes = await Sistema.count();
    
    if (sistemasExistentes > 0) {
      console.log('Sistemas já existem no banco de dados. Pulando seed.');
      return;
    }

    // Criar alguns sistemas de exemplo apenas se não existirem dados
    await Sistema.bulkCreate([
      {
        nome: 'Sistema de RH',
        descricao: 'Sistema para gerenciamento de recursos humanos',
        url: 'http://rh.empresa.com',
        status: 'ativo',
        versao: '1.0.0',
        responsavel: 'João Silva',
        observacoes: 'Sistema principal de RH'
      },
      {
        nome: 'Sistema Financeiro',
        descricao: 'Sistema de gestão financeira e contábil',
        url: 'http://financeiro.empresa.com',
        status: 'ativo',
        versao: '2.1.0',
        responsavel: 'Maria Santos',
        observacoes: 'Integrado com banco central'
      },
      {
        nome: 'Portal de Vendas',
        descricao: 'Sistema de e-commerce e gestão de vendas',
        url: 'http://vendas.empresa.com',
        status: 'manutencao',
        versao: '1.5.0',
        responsavel: 'Pedro Oliveira',
        observacoes: 'Em atualização para nova versão'
      }
    ]);

    console.log('Sistemas de exemplo criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar sistemas de exemplo:', error);
  }
}

module.exports = seedSistemas;
