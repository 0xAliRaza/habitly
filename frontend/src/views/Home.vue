<template>
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
          <h2>Today's Intentions</h2>
          <transition name="slide-in">
            <div class="py-3" v-if="todaysIntentions.length < 1">
              <p class="alert alert-info p-2">No intentions for today!</p>
            </div>
            <div class="py-3" v-else>
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
      <aside class="my-3 col-12 col-lg-4 col-xl-4">
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

    const todaysIntentions = computed(
      () => store.getters['intentions/getTodays']
    );

    const completing = ref(null);

    const completeIntention = async (intention) => {
      const formData = { ...intention };
      completing.value = formData.id;
      formData.habit = formData.habit.id;
      formData.done = true;
      try {
        await store.dispatch('intentions/update', {
          formData: formData,
          pk: formData.id,
        });
      } catch (e) {
        console.log(e);
      } finally {
        completing.value = null;
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
      completeIntention,
      getFormattedDate,
    };
  },
};
</script>
<style lang="scss" scoped>
.list-group h5 {
  padding: pxToRem(12);
}
.intention-done-checkbox {
  border-color: $gray-400;
  margin: 0;
  cursor: pointer;
  // height: 1.1em;
  // width: 1.1em;
  // border-radius: 0.27em;
}
</style>
