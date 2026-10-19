/**
 * Form configuration and submission helpers
 */

// Active environment: 'staging' or 'production'
export const FORM_ENV = process.env.NEXT_PUBLIC_FORM_ENV || 'staging';

// Default URLs
const DEFAULT_STAGING_URL = 'https://staging.myformcapture.com/f/6506e87c-d573-497a-84c3-7a407b395658';
const DEFAULT_PRODUCTION_URL = 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd';

export const formEndpoints = {
  // General forms (Enquiry & Exit-intent)
  general: {
    staging:
      process.env.NEXT_PUBLIC_FORM_STAGING_URL ||
      DEFAULT_PRODUCTION_URL,
    production:
      process.env.NEXT_PUBLIC_FORM_PRODUCTION_URL ||
      DEFAULT_PRODUCTION_URL,
  },

  // Scheduling form
  scheduling: {
    staging:
      process.env.NEXT_PUBLIC_SCHEDULING_STAGING_URL ||
      process.env.NEXT_PUBLIC_FORM_STAGING_URL ||
      DEFAULT_STAGING_URL,
    production:
      process.env.NEXT_PUBLIC_SCHEDULING_PRODUCTION_URL ||
      DEFAULT_STAGING_URL,
  },

  // Contact form
  contact: {
    staging:
      process.env.NEXT_PUBLIC_CONTACT_STAGING_URL ||
      DEFAULT_PRODUCTION_URL,
    production:
      process.env.NEXT_PUBLIC_CONTACT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_FORM_PRODUCTION_URL ||
      DEFAULT_PRODUCTION_URL,
  },

  // Newsletter form
  newsletter: {
    staging:
      process.env.NEXT_PUBLIC_NEWSLETTER_STAGING_URL ||
      DEFAULT_PRODUCTION_URL,
    production:
      process.env.NEXT_PUBLIC_NEWSLETTER_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_FORM_PRODUCTION_URL ||
      DEFAULT_PRODUCTION_URL,
  },
};

/**
 * Resolves active form endpoint based on environment
 */
export function getFormEndpoint(formType = 'general') {
  // Custom override
  if (process.env.NEXT_PUBLIC_MYFORMCAPTURE_ENDPOINT) {
    return process.env.NEXT_PUBLIC_MYFORMCAPTURE_ENDPOINT;
  }
  if (process.env.NEXT_PUBLIC_MYFORMCAPTURE_FORM_ID) {
    const base = FORM_ENV === 'production' ? 'https://myformcapture.com' : 'https://staging.myformcapture.com';
    return `${base}/f/${process.env.NEXT_PUBLIC_MYFORMCAPTURE_FORM_ID}`;
  }

  const group = formEndpoints[formType] || formEndpoints.general;
  const isProd = FORM_ENV === 'production';
  const defaultFallback = formType === 'scheduling' ? DEFAULT_STAGING_URL : DEFAULT_PRODUCTION_URL;
  return (isProd ? group.production : group.staging) || defaultFallback;
}

/**
 * Scheduling widget configuration
 */
export function getSchedulingConfig() {
  const actionUrl = getFormEndpoint('scheduling') || DEFAULT_STAGING_URL;
  const rawUrl = (actionUrl || '').trim();
  const uuidMatch = rawUrl.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  const uuid = uuidMatch ? uuidMatch[0] : '6506e87c-d573-497a-84c3-7a407b395658';

  let apiBase = rawUrl.includes('staging') ? 'https://staging.myformcapture.com' : 'https://myformcapture.com';
  try {
    const parsed = new URL(rawUrl);
    apiBase = parsed.origin;
  } catch (e) {
    // fallback
  }

  const cleanSubmitUrl = uuid ? `${apiBase}/f/${uuid}` : rawUrl;
  const slotsUrl = uuid ? `${cleanSubmitUrl}/slots` : '';

  return {
    actionUrl,
    uuid,
    apiBase,
    submitUrl: cleanSubmitUrl,
    slotsUrl,
  };
}

/**
 * Form submission handler
 */
export async function submitMFCForm(formDataOrFormElement, endpoint) {
  if (!endpoint) {
    throw new Error('Form endpoint is not configured. Please check your environment variables.');
  }

  let bodyData;
  if (formDataOrFormElement instanceof FormData) {
    bodyData = formDataOrFormElement;
  } else if (typeof HTMLFormElement !== 'undefined' && formDataOrFormElement instanceof HTMLFormElement) {
    bodyData = new FormData(formDataOrFormElement);
  } else {
    bodyData = new FormData();
    if (typeof formDataOrFormElement === 'object' && formDataOrFormElement !== null) {
      Object.entries(formDataOrFormElement).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          bodyData.append(key, val);
        }
      });
    }
  }

  // Spam check
  const gotcha = bodyData.get('_gotcha');
  if (gotcha) {
    // Drop spam submissions silently
    return { ok: true, silentDrop: true };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      // Browser sets multipart boundary automatically
    },
    body: bodyData,
  });

  if (!response.ok) {
    let errMessage = `Submission failed (${response.status})`;
    try {
      const data = await response.json();
      if (data && (data.error || data.message)) {
        errMessage = data.error || data.message;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errMessage);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = { success: true };
  }

  return { ok: true, data };
}
