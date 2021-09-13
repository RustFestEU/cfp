<template>
  <div v-html="mt('f-manage-auth')"></div>

  <div>
    <h3><label for="auth-email" v-t:f-contact-email-t></label></h3>

    <input type="email" name="auth-email">
    <button @click.prevent="" v-t:f-manage-auth-btn=""></button>
  </div>
</template>