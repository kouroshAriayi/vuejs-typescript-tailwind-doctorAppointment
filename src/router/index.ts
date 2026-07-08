import { createRouter, createWebHistory } from 'vue-router'
import SignupPage from '@/views/SignupPage.vue'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue';
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('@/views/AppointmtentPage.vue'),
      meta:{
        requiresAuth: true
      }
    },
  ],
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    await authStore.fetchCurrentUser();

    if (to.meta.requiresAuth && !authStore.user) {
        return "/login";
    }
});

export default router
