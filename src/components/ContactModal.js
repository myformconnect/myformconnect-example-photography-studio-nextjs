'use client';

import { useState, useEffect, useRef } from 'react';
import { getFormEndpoint, submitMFCForm } from '@/lib/formConfig';

// Fallback endpoint
const HARDCODED_CONTACT_URL = 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd';

export default function ContactModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Keyboard & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim()) errs.message = 'Please write your message.';

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
      const endpoint = getFormEndpoint('contact') || HARDCODED_CONTACT_URL;
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name.trim());
      dataToSend.append('email', formData.email.trim());
      dataToSend.append('subject', formData.subject.trim());
      dataToSend.append('message', formData.message.trim());
      dataToSend.append('_form_type', 'contact');
      dataToSend.append('_source', 'Stillframe Studio website');
      if (formData._gotcha) {
        dataToSend.append('_gotcha', formData._gotcha);
      }

      await submitMFCForm(dataToSend, endpoint);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Unable to submit your message. Your details have been preserved.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      _gotcha: '',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div className="modal-container modal-contact-container">
        <header className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">DIRECT INQUIRY</span>
            <h2 id="contact-modal-title" className="modal-title">
              Contact the Studio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close contact dialog"
            id="close-contact-modal-btn"
          >
            &times;
          </button>
        </header>

        <div className="modal-body">
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
              <h3 className="success-title">Message Received</h3>
              <p className="success-desc">
                Thanks for reaching out. Your message has been submitted successfully.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary"
                  id="contact-close-btn"
                >
                  Close
                </button>
              </div>
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
                <label htmlFor="contact-name" className="form-label">
                  Full Name <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
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
                <label htmlFor="contact-email" className="form-label">
                  Email Address <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
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
                <label htmlFor="contact-subject" className="form-label">
                  Subject <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="e.g. General inquiry or collaboration question"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`form-input ${errors.subject ? 'has-error' : ''}`}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  disabled={status === 'loading'}
                />
                {errors.subject && <span className="field-error-msg">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  Message <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  disabled={status === 'loading'}
                />
                {errors.message && <span className="field-error-msg">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="form-btn-submit"
                id="contact-submit-btn"
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <span>Send Message ↗</span>
                )}
              </button>

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
