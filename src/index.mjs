import implicitRenderHtml from './implicit.html';

// This is the demo secret key. In prod, we recommend you store
// your secret key(s) safely.
const SECRET_KEY = '1x0000000000000000000000000000000AA';

async function handlePost(request) {
    const body = await request.formData();
    // Turnstile injects a token in `cf-turnstile-response`.
    const token = body.get('cf-turnstile-response');
    const ip = request.headers.get('CF-Connecting-IP');

    // Validate the token by calling the `/siteverify` API.
    let formData = new FormData();

    // `secret_key` here is set using Wrangler secrets
    formData.append('secret', secret_key);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        body: formData,
        method: 'POST',
    });

    const outcome = await result.json();

    if (!outcome.success) {
        return new Response('The provided Turnstile token was not valid!', { status: 401 });
    }
    // The Turnstile token was successfully validated. Proceed with your application logic.
    // Validate login, redirect user, etc.
    return await fetch(request)
    window.location.href = "https://www.example.com";
}

export default {
  async fetch(request, env) {
    const SITE_KEY = env.SITE_KEY
    let res = await fetch(request)

    if (request.method === 'POST') {
      return handlePost(request)
    }

    // Instantiate the API to run on specific elements, for example, `head`, `div`
    let newRes = new HTMLRewriter()
      // `.on` attaches the element handler and this allows you to match on element/attributes or to use the specific methods per the API
      .on('head', {
        element(element) {

          // In this case, you are using `append` to add a new script to the `head` element
          element.append(`<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`, { html: true });
        },
      })
      .on('div', {
        element(element) {
          // You are using the `getAttribute` method here to retrieve the `id` or `class` of an element
          if (element.getAttribute('id') === <NAME_OF_ATTRIBUTE>) {
            element.append(`<div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>`, { html: true });
          }
        },
      })
      .transform(res);
    return newRes
  }
};
