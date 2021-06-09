<template>
  <div class="habit habit--good" tabindex="0">
    <div
      class="habit__text"
      data-bs-toggle="modal"
      :data-bs-target="`#modalTarget-${id}`"
    >
      <span>Lorem ipsum dolor sit amet consectetur</span>
    </div>
    <div class="habit__checkbox">
      <input type="checkbox" class="form-check-input" />
    </div>
  </div>

  <!-- Modal -->
  <div
    ref="modal"
    class="habit-modal modal fade"
    :id="'modalTarget-' + id"
    tabindex="-1"
    :aria-labelledby="'exampleModalLabel-' + id"
    aria-hidden="true"
  >
    <div
      class="
        modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable
      "
    >
      <div class="modal-content">
        <div class="modal-header modal-header--success">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ title || 'Do seven pushups!' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- <h5 class="habit-modal__heading">Title</h5>
          <p class="habit-modal__paragraph">Do seven pushups after lunch.</p> -->
          <h5 class="habit-modal__heading">Ritual</h5>
          <p class="habit-modal__paragraph">Washing hands at wash-bason.</p>
          <h5 class="habit-modal__heading">Description</h5>
          <p class="habit-modal__paragraph">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores,
            cupiditate quod dignissimos voluptatibus quisquam eveniet dolorum
            inventore consequuntur. Vero at enim id maiores cum illum eos totam!
            Maiores, voluptatum excepturi.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger d-inline-flex align-items-center">
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
          </button>
          <button class="btn btn-success d-inline-flex align-items-center">
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
          <!-- <button type="button" class="btn btn-dark">Save</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

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
<script>
import 'bootstrap/js/dist/modal';

// import { ref, watch } from 'vue';
export default {
  name: 'Habit',
  props: {
    id: { type: Number },
    title: { type: String },
    ritual: { type: String },
    description: { type: String },
    type: { type: String },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
};
</script>
