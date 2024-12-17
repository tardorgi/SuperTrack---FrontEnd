<template>
  <div>
    <h1>Lista de Produtos</h1>
    <button @click="abrirModal('add')" class="btn">Adicionar Produto</button>
    
    <!-- Tabela de Produtos -->
    <table class="tabela-produtos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th>Quantidade</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in produtos" :key="produto.idProduto">
          <td>{{ produto.idProduto }}</td>
          <td>{{ produto.descricao }}</td>
          <td>{{ produto.quantidade }}</td>
          <td>{{ formatCurrency(produto.valor) }}</td> <!-- Chamando o método para formatar o valor -->
          <td>
            <button @click="abrirModal('edit', produto)" class="btn editar-btn">Editar</button>
            <button @click="excluirProduto(produto.idProduto)" class="btn excluir-btn">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="modalVisivel" class="modal">
      <div class="modal-content">
        <h2>{{ modalAcao === 'add' ? 'Adicionar Produto' : 'Editar Produto' }}</h2>
        <form @submit.prevent="modalAcao === 'add' ? adicionarProduto() : atualizarProduto()">
          <label for="descricao">Descrição:</label>
          <input type="text" v-model="produtoAtual.descricao" required />

          <label for="quantidade">Quantidade:</label>
          <input type="number" v-model="produtoAtual.quantidade" required />

          <label for="valor">Valor:</label>
          <input type="number" v-model="produtoAtual.valor" required step="0.01" />

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
  name: "ProdutoView",
  setup() {
    // Estado reativo
    const produtos = ref([]);
    const modalVisivel = ref(false);
    const modalAcao = ref(""); // 'add' ou 'edit'
    const produtoAtual = reactive({
      idProduto: null,
      descricao: "",
      quantidade: null,
      valor: null,
    });

    // Função para carregar os produtos
    const carregarProdutos = async () => {
      try {
        const response = await api.get("/produtos");
        produtos.value = response.data;
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    // Função para formatar valor como moeda
    const formatCurrency = (value) => {
      if (!value) return "R$ 0,00";
      return "R$ " + parseFloat(value).toFixed(2).replace(".", ",");
    };

    // Função para abrir o modal de adicionar ou editar
    const abrirModal = (acao, produto = null) => {
      modalAcao.value = acao;
      if (acao === "edit" && produto) {
        Object.assign(produtoAtual, produto);
      } else {
        produtoAtual.idProduto = null;
        produtoAtual.descricao = "";
        produtoAtual.quantidade = null;
        produtoAtual.valor = null;
      }
      modalVisivel.value = true;
    };

    // Função para fechar o modal
    const fecharModal = () => {
      modalVisivel.value = false;
    };

    // Função para adicionar produto
    const adicionarProduto = async () => {
      try {
        const response = await api.post("/produtos", produtoAtual);
        produtos.value.push(response.data);
        fecharModal();
      } catch (error) {
        console.error("Erro ao adicionar produto:", error.response ? error.response.data : error.message);
      }
    };

    // Função para atualizar produto
    const atualizarProduto = async () => {
      try {
        const response = await api.put(`/produtos/${produtoAtual.idProduto}`, produtoAtual);
        const index = produtos.value.findIndex((p) => p.idProduto === produtoAtual.idProduto);
        if (index !== -1) {
          produtos.value[index] = response.data;
        }
        fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
      }
    };

    // Função para excluir produto
    const excluirProduto = async (id) => {
      try {
        await api.delete(`/produtos/${id}`);
        produtos.value = produtos.value.filter((produto) => produto.idProduto !== id);
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    };

    // Carregar os produtos quando o componente for montado
    onMounted(() => {
      carregarProdutos();
    });

    return {
      produtos,
      modalVisivel,
      modalAcao,
      produtoAtual,
      abrirModal,
      fecharModal,
      adicionarProduto,
      atualizarProduto,
      excluirProduto,
      formatCurrency, // Expondo o método formatCurrency para o template
    };
  },
};
</script>

<style scoped>
/* Estilos para a Tabela */
.tabela-produtos {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tabela-produtos th,
.tabela-produtos td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.tabela-produtos th {
  background-color: #f4f4f4;
}

.tabela-produtos tr:nth-child(even) {
  background-color: #f9f9f9;
}

.tabela-produtos tr:hover {
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
