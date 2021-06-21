<template>
  <div class="container">
    <div class="row justify-content-center">
      <!-- <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <toggle
            color="dark"
            btn-text="Create intention"
            @toggle="onFormToggle"
            :visibility="formVisible"
          ></toggle>
        </div>
      </div> -->
      <div v-if="formVisible" class="col-lg-6 mb-5">
        <form @submit.prevent>
          <div class="mb-3">
            <label for="habit" class="form-label">Habit</label>
          </div>

          <div class="d-flex justify-content-end">
            <submit-button
              :loading="formSubmitting"
              :disabled="formInvalid"
              color="primary"
              @submit="onFormSubmit"
            ></submit-button>
          </div>
        </form>
      </div>
      <div class="col-sm-12">
        <div
          class="
            py-2
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <p class="alert-info p-2" v-if="!habit">Habit does not exist.</p>
          <template v-else>
            <h1>Habit Details</h1>
            <div class="py-3">
              <div>
                <h5>Title</h5>
                <p>{{ habit.title }}</p>
              </div>
              <div>
                <h5>Type</h5>
                <p v-if="habit.type === 'G'">Good</p>
                <p v-else-if="habit.type === 'B'">Bad</p>
              </div>
              <template v-if="habit.ritual">
                <div>
                  <h5>Ritual</h5>
                  <p>{{ habit.ritual }}</p>
                </div>
              </template>
              <template v-if="habit.description">
                <div>
                  <h5>Description</h5>
                  <p>{{ habit.description }}</p>
                </div>
              </template>
              <div>
                <h5>Created at</h5>
                <p>{{ getFormattedDate(habit.created_at) }}</p>
              </div>
              <div>
                <h5>Updated at</h5>
                <p>{{ getFormattedDate(habit.updated_at) }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@/components/Toggle.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import { reactive, ref, computed, watch, watchEffect } from 'vue';
import { DatePicker } from 'v-calendar';
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
export default {
  components: {
    Toggle,
    SubmitButton,
    DatePicker,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    let pk = computed(() => {
      const id = route.params.id;
      console.log('pk watch>>>', id);
      return id;
    });
    const habit = ref(null);
    watchEffect(() => {
      if (pk.value) {
        habit.value = store.getters['habits/get'](pk.value);
        console.log('habitt computed>>>>', habit.value);
      }
    });
    const formInitialState = {
      habit: habit.value,
      date: null,
    };
    const form = reactive({ ...formInitialState });
    const formVisible = ref(false);
    const formSubmitting = ref(false);
    const formInvalid = computed(() => !form.date);

    const onFormToggle = () => {
      Object.assign(form, formInitialState);
      formVisible.value = !formVisible.value;
    };

    const onFormSubmit = async () => {
      formSubmitting.value = true;

      try {
        setTimeout(() => {
          return;
        }, 3000);
      } catch (e) {
        console.log('%cIntentions.vue line:112 e', 'color: #007acc;', e);
      } finally {
        onFormToggle();
        formSubmitting.value = false;
      }
    };

    const deleting = ref(null);

    const onDelete = async (pk) => {
      deleting.value = pk;
      return;
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
      habit,
      form,
      formVisible,
      formSubmitting,
      formInvalid,
      onDelete,
      deleting,
      onFormToggle,
      onFormSubmit,
      getFormattedDate,
    };
  },
};
</script>

<style lang="scss" scoped></style>
