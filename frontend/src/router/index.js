import { createRouter, createWebHistory } from 'vue-router';
import { AuthenticationGuard } from 'vue-auth0-plugin';

import Home from '@/views/Home.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: AuthenticationGuard,
  },
  {
    path: '/habits',
    name: 'Habits',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/Habits.vue'),
    beforeEnter: AuthenticationGuard,
  },
  {
    path: '/habits/:id',
    name: 'HabitDetail',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/HabitDetail.vue'),
    beforeEnter: AuthenticationGuard,
  },
  {
    path: '/stacks',
    name: 'Stacks',
    component: () =>
      import(/* webpackChunkName: "stacks" */ '../views/Stacks.vue'),
    beforeEnter: AuthenticationGuard,
  },
  {
    path: '/intentions',
    name: 'Intentions',
    component: () =>
      import(/* webpackChunkName: "stacks" */ '../views/Intentions.vue'),
    beforeEnter: AuthenticationGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
