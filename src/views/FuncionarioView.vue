<template>
    <div>
      <h1>Lista de Funcionários</h1>
      <button @click="abrirModal('add')" class="btn">Adicionar Funcionário</button>
  
      <!-- Tabela de Funcionários -->
      <table class="tabela-funcionarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Função</th>
            <th>Aniversário</th>
            <th>Admissão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="funcionario in funcionarios" :key="funcionario.idFuncionario">
            <td>{{ funcionario.idFuncionario }}</td>
            <td>{{ funcionario.nome }}</td>
            <td>{{ funcionario.funcao }}</td>
            <td>{{ formatDate(funcionario.aniversario) }}</td>
            <td>{{ formatDate(funcionario.admissao) }}</td>
            <td>
              <button @click="abrirModal('edit', funcionario)" class="btn editar-btn">Editar</button>
              <button @click="excluirFuncionario(funcionario.idFuncionario)" class="btn excluir-btn">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal -->
      <div v-if="modalVisivel" class="modal">
        <div class="modal-content">
          <h2>{{ modalAcao === 'add' ? 'Adicionar Funcionário' : 'Editar Funcionário' }}</h2>
          <form @submit.prevent="modalAcao === 'add' ? adicionarFuncionario() : atualizarFuncionario()">
            <label for="nome">Nome:</label>
            <input type="text" v-model="funcionarioAtual.nome" required />
  
            <label for="funcao">Função:</label>
            <input type="text" v-model="funcionarioAtual.funcao" required />
  
            <label for="aniversario">Aniversário:</label>
            <input type="date" v-model="funcionarioAtual.aniversario" required />
  
            <label for="admissao">Admissão:</label>
            <input type="date" v-model="funcionarioAtual.admissao" required />
  
            <label for="senha">Senha:</label>
            <input type="password" v-model="funcionarioAtual.senha" required />
  
            <button type="submit" class="btn">{{ modalAcao === 'add' ? 'Adicionar' : 'Salvar' }}</button>
            <button type="button" @click="fecharModal()" class="btn cancelar-btn">Cancelar</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from "vue";
  import api from "@/services/api";
  
  export default {
    name: "FuncionarioView",
    setup() {
      // Estado reativo
      const funcionarios = ref([]);
      const modalVisivel = ref(false);
      const modalAcao = ref(""); // 'add' ou 'edit'
      const funcionarioAtual = reactive({
        idFuncionario: null,
        nome: "",
        aniversario: "",
        admissao: "",
        senha: "",
        funcao: "",
      });
  
      // Função para carregar os funcionários
      const carregarFuncionarios = async () => {
        try {
          const response = await api.get("/funcionarios");
          funcionarios.value = response.data;
        } catch (error) {
          console.error("Erro ao carregar funcionários:", error);
        }
      };
  
      // Função para formatar data
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString();
      };
  
      // Função para abrir o modal de adicionar ou editar
      const abrirModal = (acao, funcionario = null) => {
        modalAcao.value = acao;
        if (acao === "edit" && funcionario) {
          Object.assign(funcionarioAtual, funcionario);
        } else {
          funcionarioAtual.idFuncionario = null;
          funcionarioAtual.nome = "";
          funcionarioAtual.funcao = "";
          funcionarioAtual.aniversario = "";
          funcionarioAtual.admissao = "";
          funcionarioAtual.senha = "";
        }
        modalVisivel.value = true;
      };
  
      // Função para fechar o modal
      const fecharModal = () => {
        modalVisivel.value = false;
      };
  
      // Função para adicionar funcionário
      const adicionarFuncionario = async () => {
        try {
          const response = await api.post("/funcionarios", funcionarioAtual);
          funcionarios.value.push(response.data);
          fecharModal();
        } catch (error) {
          console.error("Erro ao adicionar funcionário:", error.response ? error.response.data : error.message);
        }
      };
  
      // Função para atualizar funcionário
      const atualizarFuncionario = async () => {
        try {
          const response = await api.put(`/funcionarios/${funcionarioAtual.idFuncionario}`, funcionarioAtual);
          const index = funcionarios.value.findIndex((f) => f.idFuncionario === funcionarioAtual.idFuncionario);
          if (index !== -1) {
            funcionarios.value[index] = response.data;
          }
          fecharModal();
        } catch (error) {
          console.error("Erro ao atualizar funcionário:", error);
        }
      };
  
      // Função para excluir funcionário
      const excluirFuncionario = async (id) => {
        try {
          await api.delete(`/funcionarios/${id}`);
          funcionarios.value = funcionarios.value.filter((funcionario) => funcionario.idFuncionario !== id);
        } catch (error) {
          console.error("Erro ao excluir funcionário:", error);
        }
      };
  
      // Carregar os funcionários quando o componente for montado
      onMounted(() => {
        carregarFuncionarios();
      });
  
      return {
        funcionarios,
        modalVisivel,
        modalAcao,
        funcionarioAtual,
        abrirModal,
        fecharModal,
        adicionarFuncionario,
        atualizarFuncionario,
        excluirFuncionario,
        formatDate, // Expondo o método formatDate para o template
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para a Tabela */
  .tabela-funcionarios {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .tabela-funcionarios th,
  .tabela-funcionarios td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .tabela-funcionarios th {
    background-color: #f4f4f4;
  }
  
  .tabela-funcionarios tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .tabela-funcionarios tr:hover {
    background-color: #f1f1f1;
  }
  
  /* Estilos dos Botões */
  .btn {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-right: 8px;
  }
  
  .btn:hover {
    background-color: #45a049;
  }
  
  .editar-btn {
    background-color: #008CBA;
  }
  
  .editar-btn:hover {
    background-color: #007bb5;
  }
  
  .excluir-btn {
    background-color: #f44336;
  }
  
  .excluir-btn:hover {
    background-color: #e53935;
  }
  
  .cancelar-btn {
    background-color: #e0e0e0;
  }
  
  .cancelar-btn:hover {
    background-color: #d6d6d6;
  }
  
  /* Estilos do Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .modal-content button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
  }
  
  .modal-content h2 {
    margin-top: 0;
  }
  </style>
  