import requests
import random
import string
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# URL da API (endpoint corrigido)
API_URL = os.getenv('API_URL', 'http://localhost:3001/users')  # Endpoint correto: /users

# Função para gerar dados aleatórios para o cliente
def gerar_dados_cliente():
    nome = ''.join(random.choices(string.ascii_letters, k=10))  # Nome aleatório
    email = f"{nome.lower()}@teste.com"  # Email baseado no nome
    cpf = ''.join(random.choices(string.digits, k=11))  # CPF aleatório
    telefone = f"119{''.join(random.choices(string.digits, k=8))}"  # Telefone aleatório
    cargo = random.choice(["Analista", "Gerente", "Desenvolvedor", "Designer"])
    departamento = random.choice(["TI", "RH", "Vendas", "Marketing"])
    observacoes = "Cliente de teste gerado automaticamente."

    return {
        "nome": nome,
        "email": email,
        "cpf": cpf,
        "telefone": telefone,
        "cargo": cargo,
        "departamento": departamento,
        "observacoes": observacoes,
        "senha": "senha123",  # Senha padrão para clientes de teste
        "ativo": True,  # Usuário ativo por padrão
        "empresas": [1]  # IDs das empresas associadas (ajuste conforme necessário)
    }

# Função para cadastrar um cliente
def cadastrar_cliente(usuario):
    try:
        response = requests.post(f"{API_URL}", json=usuario)
        response.raise_for_status()  # Lança uma exceção para erros HTTP
        print(f"Usuário {usuario['nome']} criado com sucesso:", response.json())
    except requests.exceptions.HTTPError as http_err:
        print(f"Erro HTTP ao criar usuário {usuario['nome']}: {http_err}")
        if response.content:
            try:
                print("Detalhes do erro:", response.json())
            except ValueError:
                print("Resposta da API (não é JSON):", response.text)
    except Exception as err:
        print(f"Erro ao criar usuário {usuario['nome']}: {err}")

# Função principal para cadastrar múltiplos clientes de teste
def cadastrar_clientes_de_teste(quantidade):
    for i in range(quantidade):
        dados_cliente = gerar_dados_cliente()
        print(f"Cadastrando cliente {i + 1}: {dados_cliente['nome']}")
        cadastrar_cliente(dados_cliente)

# Executar o script
if __name__ == "__main__":
    quantidade_clientes = 10  # Número de clientes de teste a serem cadastrados
    cadastrar_clientes_de_teste(quantidade_clientes)