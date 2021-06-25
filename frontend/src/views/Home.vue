<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 col-lg-8 my-3">
        <div class="d-flex justify-content-center align-items-center py-3">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis
          tempore dignissimos harum quis eos natus eum commodi. Laborum
          voluptates ea recusandae similique consectetur debitis maiores
          consequatur officia ratione sapiente! Aliquid, laborum esse veniam
          tempore optio quod corrupti ut reprehenderit ab non ipsum eveniet
          delectus voluptatem fugit asperiores? Ratione beatae iusto itaque
          eligendi quo dolore numquam, aliquam in quos laudantium voluptates
          perferendis illo quae accusamus esse autem est voluptatum magni?
          Quidem distinctio unde nihil, repellendus odit odio quam velit
          voluptatum? Dicta aliquid repellendus sint consectetur. Rem cumque
          dolorum reprehenderit consectetur saepe, sequi repellendus quaerat
          nihil soluta pariatur quod neque cupiditate possimus molestiae eaque
          nemo ducimus exercitationem mollitia molestias? Quas officiis tempore
          totam suscipit dignissimos saepe omnis, ratione repellat, similique
          laudantium esse pariatur quos voluptatum ea deleniti nisi, asperiores
          recusandae eligendi officia aspernatur. Obcaecati, minus blanditiis
          excepturi, iusto fugit quibusdam aspernatur neque officiis libero
          voluptates tempore et voluptate deserunt. Minima quo accusamus
          quibusdam harum nobis sit, fugiat ut unde nisi, dolorum possimus
          dignissimos numquam neque id quas debitis blanditiis obcaecati. Ut
          consequuntur tempora, ab quia inventore, sequi tenetur veritatis
          ipsum, vel laborum dolorem expedita. Repudiandae nisi ex
          necessitatibus fugiat magnam aperiam, sint corporis, quibusdam numquam
          asperiores quasi! Dicta blanditiis totam dignissimos suscipit?
        </div>
      </div>
      <aside class="my-3 col-12 col-lg-4 col-xl-4">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <ul class="list-group" v-if="topRepeated.length > 0">
            <h5 class="text-center list-group-item m-0 bg-light text-dark p-3">
              Top Repeated Habits
            </h5>
            <template v-for="habit in topRepeated" :key="habit.id">
              <router-link
                v-if="habit.repetitions > 0"
                :to="`/habits/${habit.id}`"
                custom
                v-slot="{ navigate }"
              >
                <li
                  class="
                    list-group-item list-group-item-action
                    d-flex
                    justify-content-between
                    align-items-start
                    sidebar-list-item
                  "
                  style="cursor: pointer"
                  role="link"
                  @click="navigate"
                >
                  <div class="me-auto text-dark">{{ habit.title }}</div>
                  <span
                    class="badge rounded-pill ms-2"
                    :class="{
                      'bg-success': habit.type == 'G',
                      'bg-danger': habit.type == 'B',
                    }"
                    >{{ habit.repetitions }}</span
                  >
                </li>
              </router-link>
            </template>
          </ul>
          <ul class="list-group mt-3" v-if="topStreaked.length > 0">
            <h5 class="text-center list-group-item m-0 bg-light text-dark p-3">
              Top Streaked Habits
            </h5>
            <template v-for="habit in topStreaked" :key="habit.id">
              <router-link
                v-if="habit.streak > 0"
                :to="`/habits/${habit.id}`"
                custom
                v-slot="{ navigate }"
              >
                <li
                  class="
                    list-group-item list-group-item-action
                    d-flex
                    justify-content-between
                    align-items-start
                    sidebar-list-item
                  "
                  style="cursor: pointer"
                  role="link"
                  @click="navigate"
                >
                  <div class="me-auto text-dark">{{ habit.title }}</div>
                  <span
                    class="badge rounded-pill ms-2"
                    :class="{
                      'bg-success': habit.type == 'G',
                      'bg-danger': habit.type == 'B',
                    }"
                    >{{ habit.streak }} days</span
                  >
                </li>
              </router-link>
            </template>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, watchEffect } from '@vue/runtime-core';

export default {
  name: 'Home',
  setup() {
    const store = useStore();
    const topRepeated = ref([]);
    const topStreaked = ref([]);
    watchEffect(async () => {
      if (store.state.habits.refreshed) {
        topRepeated.value = await store.dispatch('habits/topFiveByRepetitions');
        topStreaked.value = await store.dispatch('habits/topFiveByStreaks');
      }
    });
    return { topRepeated, topStreaked };
  },
};
</script>
<style lang="scss" scoped></style>
