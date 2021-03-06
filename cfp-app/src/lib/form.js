import { getLocale } from "./l10n.js";
import Configuration from '../data/config.js';


export async function check(submission) {
  if (!submission.email) return false;

  return true;
}

export async function verify(email) {
  return await fetch(`${Configuration.backend}/email-verification/request`, {
    method: 'post',
    headers: {
      'Content-Type':'application/json',
      'Accept-Language': getLocale(),
    },
    body: JSON.stringify({
      email,
      reason:'proposal submission'
    })
  }).then(r => r.text());
}

export async function submit(submission, ptx, code) {
  return await fetch(`${Configuration.backend}/cfp/submit`, {
    method: 'post',
    headers: {
      'Content-Type':'application/json',
      'Accept-Language': getLocale(),
    },
    body: JSON.stringify({
      ...submission,
      ptx,
      code,
    })
  }).then(r => r.text());
}