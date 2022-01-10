<template>
  <div>
    <template v-if="error.response && error.response.data">
      <p
        class="alert alert-danger p-2 mb-1"
        v-for="(value, key) in error.response.data"
        :key="key"
      >
        <span class="text-capitalize"> {{ key }}: </span>
        <span v-for="msg in value" :key="msg"> {{ msg }} </span>
      </p>
    </template>
    <p class="alert alert-danger p-2 mb-1" v-else-if="error.status">
      {{ error.status
      }}<span class="ms-1" v-if="error.statusText">
        {{ error.statusText }}
      </span>
    </p>
    <p class="alert alert-danger p-2 mb-1" v-else-if="error.message">
      {{ error.message }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Errors',
  props: {
    error: Object,
  },
};
</script>
