<script setup>
import { ref, reactive, computed, watchEffect } from 'vue';

import { $mt } from '../lib/markdown.js';

import { verify, submit } from '../lib/form.js';


const props = defineProps({
  email: String,
  confirmDialog: Boolean,
  submission: Object,
  submissionPtx: String,
});

const emit = defineEmits(['update:confirmDialog']);

const status = ref('');
const verificationCode = ref('');
const errorMessage = ref('');

// If we open the confirmation dialog, send a verification email
// TODO: tie this to explicit button? (with 're-send' option?)
watchEffect(async () => {
  status.value = '';
  if (!props.confirmDialog) return;

  try {
    await verify(props.email);
  }
  catch(e) {
    // TODO: backend failed?
    return console.log(e);
  }

  status.value = 'emailSent';
});

function submitProposalSend(event) {
  try {
    submit(props.submission, props.submissionPtx, verificationCode.value);
  }
  catch(e) {
    console.log(e);
    errorMessage.value = 'f-submit-error-generic';
    return;
  }

  status.value = 'submitted';
}

function submitProposalCancel() {
  verificationCode.value = '';
  errorMessage.value = '';
  status.value = '';

  emit('update:confirmDialog', false);
}
</script>


<template>

<slot></slot>

<vue-final-modal v-model="confirmDialog" classes="modal-container" content-class="modal-content">
  <button class="modal__close" @click.prevent="submitProposalCancel">
    <svg focusable="false" width="2em" height="2em" viewBox="0 0 24 24" data-v-7ca2000c=""><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" fill="currentColor"></path></svg>
  </button>
  <span class="modal__title" v-html="$t(status === 'submitted' ? 'f-submit-status-success-t' : 'f-submit-dialog-t')"></span>

  <div class="modal__content" v-if="status === ''" v-t:f-submit-status-sending-verification></div>

  <div class="modal__content" v-if="status === 'emailSent'">
    <div v-html="$mt('f-submit-status-enter-verification-code', {email})"></div>

    <input type="tel" v-model.number="verificationCode" />
    <span class="error" v-t:[errorMessage]></span>
  </div>

  <div class="modal__content" v-if="status === 'submitted'" v-html="$mt('f-submit-status-success')">
  </div>

  <div class="modal__action" v-show="status !== 'submitted'">
    <button
      class="v-btn"
      @click.prevent="submitProposalSend"
      :disabled="verificationCode.length<4"
      v-t:f-submit-confirm-btn
    >
    </button>
    <button
      class="v-btn"
      @click.prevent="submitProposalCancel"
      v-t:f-cancel-btn
    ></button>
  </div>
</vue-final-modal>

</template>


<style scoped>
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__close {
 	position: absolute;
	top: .5rem;
	right: .5rem;
	padding: .4rem;
	border-radius: .4rem;
	line-height: 0;
}

button.v-btn {
  padding: .25rem .5rem;
  border-width: 1px;
  border-radius: .25rem;
}
button.v-btn + button.v-btn {
  margin: 0 0 0 1rem;
}

.error {
  font-weight: bold;
  color: red;
}

input[type="tel"] {
	border: 1px solid var(--c-teal-400);
	border-radius: .25rem;
	background: var(--c-gray-900);
	padding: .75rem 1.25rem;
  
  display: block;
  margin: 1.5rem auto 1rem;

  font-size: 2rem;
  width: 9ch;
  color: var(--c-magenta-300);
  text-align: center;
}

button[disabled] {
  background: var(--c-teal-900);
  color: var(--c-gray-600);
  cursor: default;
  border-color: transparent;
}

</style>