import { createRouter, createWebHistory } from 'vue-router';
import { routeGuard } from '@/auth';
import Home from '@/views/Home.vue';
import ErrorPage from '@/views/Error.vue';
import Callback from '@/views/Callback.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: routeGuard,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/habits',
    name: 'Habits',
    component: () =>
      import(/* webpackChunkName: "habits" */ '../views/Habits.vue'),
    beforeEnter: routeGuard,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
