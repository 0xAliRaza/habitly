<template>
  <transition name="fade">
    <yayy v-show="yayy"></yayy>
  </transition>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 my-3">
        <div
          class="
            d-flex
            flex-column
            align-items-center
            justify-content-center
            p-3
          "
        >
          <h2>Intentions for Today</h2>
          <transition name="slide-in">
            <div class="py-4" v-if="todaysIntentions.length < 1">
              <p class="alert alert-info p-2">No intentions for today!</p>
            </div>
            <div class="py-4" v-else>
              <div
                v-for="intention in todaysIntentions"
                :key="intention.id"
                class="d-flex justify-content-between align-items-start mb-3"
              >
                <p class="m-0">
                  I will
                  <router-link :to="`/habits/${intention.habit.id}`">{{
                    intention.habit.title
                  }}</router-link>
                  at
                  <span
                    :title="getFormattedDate(intention.time, true)"
                    class="text-primary"
                    >{{ getFormattedDate(intention.time) }}</span
                  >
                  in
                  <span class="text-primary">{{ intention.location }}</span
                  >.
                </p>
                <div
                  class="
                    text-nowrap
                    px-2
                    py-1
                    ms-2
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                >
                  <input
                    type="checkbox"
                    class="
                      form-check-input
                      m-0
                      intention-done-checkbox intention-done-checkbox
                    "
                    @click.prevent="completeIntention(intention)"
                    :checked="intention.done"
                    :disabled="completing"
                    v-if="completing !== intention.id"
                  />
                  <span
                    v-else
                    class="spinner-border spinner-border-sm text-primary"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <aside class="my-3 py-3 col-12 col-lg-4">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <transition name="fade">
            <ul class="list-group" v-if="topRepeated.length > 0">
              <h5 class="text-center list-group-item m-0 bg-light text-dark">
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
                    <div class="me-auto">{{ habit.title }}</div>
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
          </transition>
          <transition name="fade">
            <ul class="list-group mt-3" v-if="topStreaked.length > 0">
              <h5 class="text-center list-group-item m-0 bg-light text-dark">
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
                    <div class="me-auto">{{ habit.title }}</div>
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
          </transition>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watchEffect } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import Yayy from '@/components/Yayy.vue';

export default {
  name: 'Home',
  components: {
    Yayy,
  },
  setup() {
    const store = useStore();
    const topRepeated = computed(() => store.state.habits.topRepeated);
    const topStreaked = computed(() => store.state.habits.topStreaked);
    watchEffect(() => {
      if (
        store.state.habits.refreshed &&
        !store.state.habits.topRepeatedRefreshed &&
        !store.state.habits.topStreakedRefreshed
      ) {
        store.dispatch('habits/refreshTopRepeated');
        store.dispatch('habits/refreshTopStreaked');
      }
    });

    const todaysIntentions = computed(
      () => store.getters['intentions/getTodays']
    );

    const completing = ref(null);
    const yayy = ref(false);
    const completeIntention = async (intention) => {
      const formData = { ...intention };
      completing.value = formData.id;
      formData.habit = formData.habit.id;
      formData.done = true;
      let error;
      try {
        await store.dispatch('intentions/update', {
          formData: formData,
          pk: formData.id,
        });
      } catch (e) {
        error = e;
      } finally {
        completing.value = null;
        if (!error) {
          yayy.value = true;
          setTimeout(() => {
            yayy.value = false;
          }, 1000);
        }
      }
    };

    const getFormattedDate = (ISOString, long = false) => {
      if (long) {
        return DateTime.fromISO(ISOString).toLocaleString(
          DateTime.DATETIME_FULL
        );
      } else {
        return DateTime.fromISO(ISOString).toLocaleString(
          DateTime.DATETIME_MED_WITH_WEEKDAY
        );
      }
    };

    return {
      topRepeated,
      topStreaked,
      todaysIntentions,
      completing,
      yayy,
      completeIntention,
      getFormattedDate,
    };
  },
};
</script>
<style lang="scss" scoped>
aside {
  max-width: pxToRem(420);
}
.list-group h5 {
  padding: pxToRem(12);
}
.intention-done-checkbox {
  border-color: $gray-400;
  margin: 0;
  cursor: pointer;
}
</style>
