import { createRouter, createWebHistory } from 'vue-router';
import { routeGuard } from '@/auth';
import Home from '@/views/Home.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/habits',
  },
  {
    path: '/habits',
    name: 'Habits',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/Habits.vue'),
    beforeEnter: routeGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
