import { createRouter, createWebHistory } from 'vue-router';
import { routeGuard } from '@/auth';
import Home from '@/views/Home.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/habits',
    name: 'Habits',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/Habits.vue'),
    beforeEnter: routeGuard,
  },
  {
    path: '/stacks',
    name: 'stacks',
    component: () =>
      import(/* webpackChunkName: "stacks" */ '../views/Stacks.vue'),
    beforeEnter: routeGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
