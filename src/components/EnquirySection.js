'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';
import { getFormEndpoint, submitMFCForm } from '@/lib/formConfig';
import { openBookingModal, openContactModal } from '@/components/GlobalModals';

// Fallback endpoint
const HARDCODED_ENQUIRY_URL = 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd';

export default function EnquirySection() {
  const { enquiry } = siteConfig;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    date: '',
    location: '',
    message: '',
    _gotcha: '', // Honeypot
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a project category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
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

    if (!validate()) {
      return;
    }

    const endpoint = getFormEndpoint('general') || HARDCODED_ENQUIRY_URL;
    if (!endpoint) {
      setStatus('error');
      setErrorMessage(
        'MyFormCapture endpoint is not configured. Please set NEXT_PUBLIC_FORM_STAGING_URL or NEXT_PUBLIC_FORM_PRODUCTION_URL in your environment (.env.local).'
      );
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Form payload
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('email', formData.email.trim());
      payload.append('category', formData.category);
      if (formData.phone.trim()) payload.append('phone', formData.phone.trim());
      if (formData.date) payload.append('date', formData.date);
      if (formData.location.trim()) payload.append('location', formData.location.trim());
      if (formData.message.trim()) payload.append('message', formData.message.trim());
      payload.append('_source', enquiry.sourceAttribution || 'Stillframe Studio website');
      payload.append('_form_type', 'project_enquiry');

      // Anti-spam check
      if (formData._gotcha) {
        payload.append('_gotcha', formData._gotcha);
      }

      // Submit form
      await submitMFCForm(payload, endpoint);

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Unable to submit your enquiry at this time. Your details have been preserved.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      date: '',
      location: '',
      message: '',
      _gotcha: '',
    });
    setErrors({});
  };

  return (
    <section id="enquiry" className="enquiry-section" aria-labelledby="enquiry-heading">
      <div className="container">
        <div className="enquiry-grid">
          {/* Studio info & actions */}
          <div className="enquiry-intro-col">
            <h2 id="enquiry-heading" className="enquiry-heading">
              {enquiry.heading}
            </h2>
            <p className="enquiry-copy">{enquiry.copy}</p>

            <div className="enquiry-secondary-actions">
              <button
                type="button"
                onClick={openBookingModal}
                className="btn-secondary-dark"
                id="enquiry-schedule-call-btn"
              >
                Schedule a Call ↗
              </button>

              <button
                type="button"
                onClick={openContactModal}
                className="contact-studio-link"
                id="enquiry-contact-link"
              >
                Have a general question? Contact us.
              </button>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="enquiry-form-card">
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
                <h3 className="success-title">Thank you for reaching out</h3>
                <p className="success-desc">
                  We have received your project details. We will review our schedule and get back to you within 24 to 48 hours.
                </p>
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

                {/* Name & email */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-name" className="form-label">
                      Full Name <span className="required-mark" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      disabled={status === 'submitting'}
                    />
                    {errors.name && (
                      <span id="name-error" className="field-error-msg">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="enquiry-email" className="form-label">
                      Email Address <span className="required-mark" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={status === 'submitting'}
                    />
                    {errors.email && (
                      <span id="email-error" className="field-error-msg">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category & phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-category" className="form-label">
                      Project Category <span className="required-mark" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="enquiry-category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className={`form-select ${errors.category ? 'has-error' : ''}`}
                      aria-invalid={errors.category ? 'true' : 'false'}
                      aria-describedby={errors.category ? 'category-error' : undefined}
                      disabled={status === 'submitting'}
                    >
                      <option value="">Select a category...</option>
                      {enquiry.categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span id="category-error" className="field-error-msg">
                        {errors.category}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="enquiry-phone" className="form-label">
                      Phone Number <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                {/* Date & location */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-date" className="form-label">
                      Preferred Date <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="enquiry-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-input"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="enquiry-location" className="form-label">
                      Project Location <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="enquiry-location"
                      name="location"
                      type="text"
                      placeholder="e.g. Brooklyn, NY or Lake Como"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="enquiry-message" className="form-label">
                    Brief Description <span className="optional-tag">(Optional)</span>
                  </label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about the vision, timeline, or atmosphere you have in mind..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    disabled={status === 'submitting'}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="form-btn-submit"
                  id="enquiry-submit-btn"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <span>{enquiry.primaryAction} ↗</span>
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
    </section>
  );
}
