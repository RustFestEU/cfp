export async function verify(email) {
  await fetch('http://localhost:1337/email-verification/request', {
    method: 'post',
    headers: {
      'content-type':'application/json'
    },
    body: JSON.stringify({
      email,
      reason:'proposal submission'
    })
  }).then(r => r.text());
}

export async function submit(submission, code) {
  await fetch('http://localhost:1337/cfp/submit', {
    method: 'post',
    headers: {
      'content-type':'application/json'
    },
    body: JSON.stringify({
      ...submission,
      code,
    })
  }).then(r => r.text());
}