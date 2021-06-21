import { createRouter, createWebHistory } from 'vue-router';
import { guard } from '@/router/guard.js';
import Home from '@/views/Home.vue';
import Login from '@/components/Login.vue';
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
    beforeEnter: guard,
  },
  {
    path: '/habits/:id',
    name: 'HabitDetail',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/HabitDetail.vue'),
    beforeEnter: guard,
  },
  {
    path: '/stacks',
    name: 'Stacks',
    component: () =>
      import(/* webpackChunkName: "stacks" */ '../views/Stacks.vue'),
    beforeEnter: guard,
  },
  {
    path: '/intentions',
    name: 'Intentions',
    component: () =>
      import(/* webpackChunkName: "stacks" */ '../views/Intentions.vue'),
    beforeEnter: guard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
