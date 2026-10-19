'use client';

import { useState, useEffect, useRef } from 'react';
import { getFormEndpoint, submitMFCForm } from '@/lib/formConfig';

// Exit intent form action URL
const EXIT_INTENT_FORM_ACTION_URL = 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd';

export default function ExitIntentPopup({ hasOtherModalOpen = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    _gotcha: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const popupRef = useRef(null);
  const triggerArmedRef = useRef(false);

  useEffect(() => {
    // Run in browser only
    if (typeof window === 'undefined') return;

    // Check session dismissal
    try {
      const dismissed = sessionStorage.getItem('stillframe_exit_intent_dismissed');
      if (dismissed) return;
    } catch {
      // Ignore sessionStorage errors in private modes
    }

    // Arm after 8s or 20% scroll
    const timer = setTimeout(() => {
      triggerArmedRef.current = true;
    }, 8000);

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 20) {
        triggerArmedRef.current = true;
      }
    };

    const handleMouseLeave = (e) => {
      // Trigger when cursor leaves top
      if (!triggerArmedRef.current) return;
      if (e.clientY > 10) return;

      // Skip if another modal is active
      if (hasOtherModalOpen) return;

      // Skip if typing in an input
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(activeTag)) return;

      // Check session storage again
      try {
        if (sessionStorage.getItem('stillframe_exit_intent_dismissed')) return;
      } catch {
        // ignore
      }

      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasOtherModalOpen]);

  // Keyboard & scroll lock
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleDismiss();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('stillframe_exit_intent_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.category) errs.category = 'Please select a project category.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const endpoint = getFormEndpoint('general') || EXIT_INTENT_FORM_ACTION_URL;
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name.trim());
      dataToSend.append('email', formData.email.trim());
      dataToSend.append('category', formData.category);
      dataToSend.append('_form_type', 'exit_intent');
      dataToSend.append('_source', 'Stillframe Studio website (Exit Intent)');
      if (formData._gotcha) {
        dataToSend.append('_gotcha', formData._gotcha);
      }

      await submitMFCForm(dataToSend, endpoint);
      setStatus('success');
      try {
        sessionStorage.setItem('stillframe_exit_intent_dismissed', 'true');
      } catch {
        // ignore
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Unable to submit your enquiry at this time. Your details have been preserved.'
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      ref={popupRef}
      onClick={(e) => {
        if (e.target === popupRef.current) handleDismiss();
      }}
    >
      <div className="modal-container modal-exit-container">
        <header className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">BEFORE YOU GO</span>
            <h2 id="exit-popup-title" className="modal-title">
              Planning something worth remembering?
            </h2>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="modal-close-btn"
            aria-label="Close dialog"
            id="close-exit-intent-btn"
          >
            &times;
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-copy">
            Tell us a little about your next project. We&apos;d love to hear what you&apos;re creating.
          </p>

          {status === 'success' ? (
            <div className="success-state-box" role="status" aria-live="polite">
              <svg
                className="success-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="success-title">Thank You</h3>
              <p className="success-desc">
                We have received your project details and will be in touch shortly.
              </p>
              <button
                type="button"
                onClick={handleDismiss}
                className="btn-primary"
                id="exit-success-close-btn"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="enquiry-form">
              {status === 'error' && (
                <div className="alert-box alert-error" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Honeypot field */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden-gotcha"
                aria-hidden="true"
              />

              <div className="form-group">
                <label htmlFor="exit-name" className="form-label">
                  Name <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="exit-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  disabled={status === 'loading'}
                />
                {errors.name && <span className="field-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="exit-email" className="form-label">
                  Email Address <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="exit-email"
                  name="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  disabled={status === 'loading'}
                />
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="exit-category" className="form-label">
                  Project Category <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <select
                  id="exit-category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? 'has-error' : ''}`}
                  aria-invalid={errors.category ? 'true' : 'false'}
                  disabled={status === 'loading'}
                >
                  <option value="">Select a category...</option>
                  <option value="Weddings & celebrations">Weddings & celebrations</option>
                  <option value="Portraits & fashion">Portraits & fashion</option>
                  <option value="Brands & commercial">Brands & commercial</option>
                  <option value="Events & experiences">Events & experiences</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <span className="field-error-msg">{errors.category}</span>}
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  id="exit-submit-btn"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Start an Enquiry ↗</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="btn-secondary"
                  id="exit-maybe-later-btn"
                >
                  Maybe later
                </button>
              </div>

              <p className="form-powered-credit">
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
      </div>
    </div>
  );
}
