<template>
  <!-- Habit start -->
  <div
    class="habit"
    tabindex="0"
    :class="{
      'habit--good': habit.type === 'G',
      'habit--bad': habit.type === 'B',
    }"
  >
    <div class="habit__text" @click="showModal">
      <span>{{ habit.title }}</span>
    </div>
    <div class="habit__checkbox">
      <input type="checkbox" class="form-check-input" />
    </div>
  </div>
  <!-- Habit end -->
  <!-- Bootstrap Modal start -->
  <div
    ref="modal"
    class="habit-modal modal fade"
    :id="habit.slug"
    tabindex="-1"
    :aria-labelledby="'habit-' + habit.slug"
    v-if="habitModalVisible"
  >
    <div
      class="
        modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable
      "
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="'habit-' + habit.slug">
            {{ habit.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <h5>Type</h5>
            <p v-if="habit.type === 'G'">Good</p>
            <p v-else-if="habit.type === 'B'">Bad</p>
          </div>
          <!-- <hr size="0" /> -->
          <template v-if="habit.ritual">
            <div>
              <h5>Ritual</h5>
              <p>{{ habit.ritual }}</p>
            </div>
            <!-- <hr size="0" /> -->
          </template>
          <template v-if="habit.description">
            <div>
              <h5>Description</h5>
              <p>{{ habit.description }}</p>
            </div>
            <!-- <hr size="0" /> -->
          </template>
          <div>
            <h5>Created at</h5>
            <p>{{ new Date(habit.created_at) }}</p>
          </div>
          <!-- <hr size="0" /> -->
          <div>
            <h5>Updated at</h5>
            <p>{{ new Date(habit.updated_at) }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-danger d-inline-flex align-items-center"
            @click.prevent="onDelete"
          >
            <template v-if="loading">
              Deleting
              <span
                class="spinner-border spinner-border-sm ms-1"
                role="status"
                aria-hidden="true"
              ></span>
            </template>
            <template v-else>
              Delete
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash ms-1"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                />
                <path
                  fill-rule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </template>
          </button>
          <button
            class="btn btn-success d-inline-flex align-items-center"
            @click.prevent="onEdit"
          >
            Edit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-square ms-1"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Bootstrap Modal End -->
</template>
<script>
import Modal from 'bootstrap/js/dist/modal';
import { ref, nextTick } from 'vue';
export default {
  name: 'Habit',
  props: {
    habit: { required: true, type: Object },
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const habitModalVisible = ref(false);
    const modal = ref(null);
    const loading = ref(false);
    let bsModal;
    const showModal = async () => {
      habitModalVisible.value = true;
      await nextTick();
      bsModal = new Modal(modal.value);
      bsModal.show();
      modal.value.addEventListener('hidden.bs.modal', () => {
        habitModalVisible.value = false;
      });
    };
    const onEdit = () => {
      bsModal.hide();
      emit('edit', props.habit);
    };
    const onDelete = async () => {
      loading.value = true;
      bsModal.hide();
      await nextTick();
      emit('delete', props.habit.id);
    };
    return {
      habitModalVisible,
      modal,
      loading,
      showModal,
      onEdit,
      onDelete,
    };
  },
};
</script>
<style lang="scss" scoped>
.habit {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-radius: pxToRem(8);
  border-top-left-radius: 0;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 pxToRem(4) pxToRem(10) 0 rgba($color-gray, 0.25);
  }

  &__text {
    flex: 1;
    margin-right: pxToRem(10);
    padding: pxToRem(12) 0 pxToRem(12) pxToRem(16);
  }
  &__checkbox {
    display: inline-flex;
    align-items: center;
    margin-right: pxToRem(16);
  }

  input[type='checkbox'] {
    height: 1.1em;
    width: 1.1em;
    border-radius: 0.27em;
    margin: 0;
    &:checked {
      background-color: $color-primary;
      &:focus {
        box-shadow: 0 0 0 0.25rem rgba($color-primary, 0.25);
      }
    }
  }
  &--good {
    background-color: rgba($color-green, 0.1);
    border: 1px solid rgba($color-green, 0.2);
    &:hover {
      background-color: rgba($color-green, 0.2);
    }
    &:focus {
      outline-color: $color-green;
    }
    input[type='checkbox'] {
      border: 1px solid rgba($color-green, 0.3);
    }
  }
  &--bad {
    background-color: rgba($color-red, 0.1);
    border: 1px solid rgba($color-red, 0.2);
    &:hover {
      background-color: rgba($color-red, 0.2);
    }
    &:focus {
      outline-color: $color-red;
    }
    input[type='checkbox'] {
      border: 1px solid rgba($color-red, 0.3);
    }
  }
}
</style>
