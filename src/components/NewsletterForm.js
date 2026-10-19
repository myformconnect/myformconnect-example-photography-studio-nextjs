'use client';

import { useState } from 'react';
import { getFormEndpoint, submitMFCForm } from '@/lib/formConfig';

// Fallback endpoint
const HARDCODED_NEWSLETTER_URL = 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please provide your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setStatus('loading');
    setErrorMessage('');

    try {
      const endpoint = getFormEndpoint('newsletter') || HARDCODED_NEWSLETTER_URL;
      const dataToSend = new FormData();
      dataToSend.append('email', cleanEmail);
      dataToSend.append('_form_type', 'newsletter');
      dataToSend.append('_source', 'Stillframe Studio website (Newsletter)');
      if (gotcha) {
        dataToSend.append('_gotcha', gotcha);
      }

      await submitMFCForm(dataToSend, endpoint);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Unable to subscribe at this moment. Please try again.'
      );
    }
  };

  return (
    <div className="footer-newsletter">
      <div className="newsletter-text">
        <h3 className="newsletter-heading">Occasional notes from the studio.</h3>
        <p className="newsletter-copy">
          Selected work, creative inspiration, and updates from behind the lens.
        </p>
      </div>

      {status === 'success' ? (
        <div className="newsletter-success-box" role="status" aria-live="polite">
          <span className="newsletter-check" aria-hidden="true">✓</span>
          <span>You&apos;re subscribed. Thanks for staying in touch.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="newsletter-form">
          {/* Honeypot field */}
          <input
            type="text"
            name="_gotcha"
            value={gotcha}
            onChange={(e) => setGotcha(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden-gotcha"
            aria-hidden="true"
          />

          <div className="newsletter-input-group">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
                if (status === 'error') {
                  setStatus('idle');
                  setErrorMessage('');
                }
              }}
              className={`newsletter-input ${error ? 'has-error' : ''}`}
              aria-label="Email address for newsletter"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary newsletter-btn"
              id="newsletter-subscribe-btn"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {error && <span className="field-error-msg">{error}</span>}
          {status === 'error' && (
            <span className="field-error-msg">{errorMessage}</span>
          )}

          <p className="form-powered-credit form-powered-credit-newsletter">
            Powered by{' '}
            <a
              href="https://myformconnect.io"
              target="_blank"
              rel="noopener noreferrer"
              className="form-powered-link"
            >
              MyFormConnect
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
