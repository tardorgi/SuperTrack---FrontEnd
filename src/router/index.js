import { createRouter, createWebHashHistory } from "vue-router";
import InicioView from "../views/InicioView.vue";
import ProdutoView from "../views/ProdutoView.vue";
import FuncionarioView from "../views/FuncionarioView.vue";
import VendasView from "../views/VendasView.vue";
import LoginView from "../views/LoginView.vue";

// Simulação de autenticação
const isAuthenticated = () => !!localStorage.getItem("authToken");

const routes = [
  {
    path: "/",
    name: "inicio",
    component: InicioView,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/sobre",
    name: "sobre",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/produtos",
    name: "produtos",
    component: ProdutoView,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/funcionarios",
    name: "funcionarios",
    component: FuncionarioView,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/vendas",
    name: "vendas",
    component: VendasView,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Middleware para verificar autenticação
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" }); // Redireciona para login se não autenticado
  } else {
    next();
  }
});

export default router;
