<template>
    <div>
      <h1>Lista de Vendas</h1>
      <button @click="abrirModal('add')" class="btn adicionar-venda">Adicionar Venda</button>
  
      <!-- Tabela de Vendas -->
      <table class="tabela-vendas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Funcionário</th>
            <th>Cliente</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venda in vendas" :key="venda.idVenda">
            <td>{{ venda.idVenda }}</td>
            <td>{{ venda.produto?.descricao }}</td>
            <td>{{ venda.funcionario?.nome }}</td>
            <td>{{ venda.cliente || venda.cliente }}</td>
            <td>{{ venda.quantidade }}</td>
            <td>{{ venda.valorTotal.toFixed(2) }}</td>
            <td>
              <button @click="abrirModal('edit', venda)" class="btn editar-btn">Editar</button>
              <button @click="excluirVenda(venda.idVenda)" class="btn excluir-btn">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal -->
      <div v-if="modalVisivel" class="modal">
        <div class="modal-content">
          <h2>{{ modalAcao === 'add' ? 'Adicionar Venda' : 'Editar Venda' }}</h2>
          <form @submit.prevent="modalAcao === 'add' ? adicionarVenda() : atualizarVenda()">
            <label for="produto">Produto:</label>
            <select v-model="vendaAtual.produto" required>
              <option v-for="produto in produtos" :key="produto.idProduto" :value="produto">
                {{ produto.descricao }}
              </option>
            </select>
  
            <label for="funcionario">Funcionário:</label>
            <select v-model="vendaAtual.funcionario" required>
              <option v-for="funcionario in funcionarios" :key="funcionario.idFuncionario" :value="funcionario">
                {{ funcionario.nome }}
              </option>
            </select>
  
            <label for="cliente">Cliente:</label>
            <input type="text" v-model="vendaAtual.cliente" required />
  
            <label for="quantidade">Quantidade:</label>
            <input type="number" v-model="vendaAtual.quantidade" required />
  
            <label for="valorTotal">Valor Total:</label>
            <input type="number" v-model="vendaAtual.valorTotal" required />
  
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
    name: "VendaView",
    setup() {
      const vendas = ref([]);
      const produtos = ref([]);
      const funcionarios = ref([]);
      const modalVisivel = ref(false);
      const modalAcao = ref(""); // 'add' ou 'edit'
      const vendaAtual = reactive({
        idVenda: null,
        produto: null,
        funcionario: null,
        cliente: "",
        quantidade: 0,
        valorTotal: 0,
      });
  
      // Função para carregar as vendas
      const carregarVendas = async () => {
        try {
          const response = await api.get("/vendas");
          vendas.value = response.data;
        } catch (error) {
          console.error("Erro ao carregar vendas:", error);
        }
      };
  
      // Função para carregar os produtos
      const carregarProdutos = async () => {
        try {
          const response = await api.get("/produtos");
          produtos.value = response.data;
        } catch (error) {
          console.error("Erro ao carregar produtos:", error);
        }
      };
  
      // Função para carregar os funcionários
      const carregarFuncionarios = async () => {
        try {
          const response = await api.get("/funcionarios");
          funcionarios.value = response.data;
        } catch (error) {
          console.error("Erro ao carregar funcionários:", error);
        }
      };
  
      // Função para abrir o modal de adicionar ou editar
      const abrirModal = (acao, venda = null) => {
        modalAcao.value = acao;
        if (acao === "edit" && venda) {
          Object.assign(vendaAtual, { ...venda });
        } else {
          vendaAtual.idVenda = null;
          vendaAtual.produto = null;
          vendaAtual.funcionario = null;
          vendaAtual.cliente = "";
          vendaAtual.quantidade = 0;
          vendaAtual.valorTotal = 0;
        }
        modalVisivel.value = true;
      };
  
      // Função para fechar o modal
      const fecharModal = () => {
        modalVisivel.value = false;
      };
  
      // Função para adicionar venda
      const adicionarVenda = async () => {
        try {
          const response = await api.post("/vendas", vendaAtual);
          vendas.value.push(response.data);
          fecharModal();
        } catch (error) {
          console.error("Erro ao adicionar venda:", error);
        }
      };
  
      // Função para atualizar venda
      const atualizarVenda = async () => {
        try {
          const response = await api.put(`/vendas/${vendaAtual.idVenda}`, vendaAtual);
          const index = vendas.value.findIndex((v) => v.idVenda === vendaAtual.idVenda);
          if (index !== -1) {
            vendas.value[index] = response.data;
          }
          fecharModal();
        } catch (error) {
          console.error("Erro ao atualizar venda:", error);
        }
      };
  
      // Função para excluir venda
      const excluirVenda = async (id) => {
        try {
          await api.delete(`/vendas/${id}`);
          vendas.value = vendas.value.filter((venda) => venda.idVenda !== id);
        } catch (error) {
          console.error("Erro ao excluir venda:", error);
        }
      };
  
      // Carregar os dados iniciais ao montar o componente
      onMounted(() => {
        carregarVendas();
        carregarProdutos();
        carregarFuncionarios();
      });
  
      return {
        vendas,
        produtos,
        funcionarios,
        modalVisivel,
        modalAcao,
        vendaAtual,
        abrirModal,
        fecharModal,
        adicionarVenda,
        atualizarVenda,
        excluirVenda,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para a tabela */
  .tabela-vendas {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .tabela-vendas th,
  .tabela-vendas td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .tabela-vendas th {
    background-color: #f4f4f4;
  }
  
  .tabela-vendas tr:hover {
    background-color: #f1f1f1;
  }
  
  /* Estilos dos botões */
  .btn {
    padding: 8px 12px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    margin: 5px;
  }
  
  .adicionar-venda {
    background-color: #28a745;
    color: white;
  }
  
  .editar-btn {
    background-color: #ffc107;
    color: white;
  }
  
  .excluir-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .cancelar-btn {
    background-color: #6c757d;
    color: white;
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
    z-index: 9999;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  form label {
    display: block;
    margin: 10px 0 5px;
  }
  
  form input,
  form select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  </style>
  