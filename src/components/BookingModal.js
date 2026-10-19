'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { getSchedulingConfig } from '@/lib/formConfig';

// Scheduling form action URL & widget configuration
const SCHEDULING_FORM_UUID = '6506e87c-d573-497a-84c3-7a407b395658';
const SCHEDULING_FORM_API_BASE = 'https://staging.myformcapture.com';
const SCHEDULING_FORM_ACTION_URL = 'https://staging.myformcapture.com/f/6506e87c-d573-497a-84c3-7a407b395658';
const SCHEDULING_FORM_SLOTS_URL = 'https://staging.myformcapture.com/f/6506e87c-d573-497a-84c3-7a407b395658/slots';

export default function BookingModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const schedulingConfig = getSchedulingConfig();
  const uuid = schedulingConfig.uuid || SCHEDULING_FORM_UUID;
  const apiBase = schedulingConfig.apiBase || SCHEDULING_FORM_API_BASE;
  const submitUrl = schedulingConfig.submitUrl || SCHEDULING_FORM_ACTION_URL;
  const slotsUrl = schedulingConfig.slotsUrl || SCHEDULING_FORM_SLOTS_URL;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Lock background scroll
    document.body.style.overflow = 'hidden';

    // Trigger widget render
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      document.dispatchEvent(new Event('turbo:render'));
    }, 60);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <link rel="stylesheet" href="/booking-widget.css" />

      {/* Booking widget script */}
      {apiBase && (
        <Script
          src={`${apiBase}/booking-widget.js`}
          strategy="afterInteractive"
          onLoad={() => {
            document.dispatchEvent(new Event('DOMContentLoaded'));
            document.dispatchEvent(new Event('turbo:render'));
          }}
        />
      )}

      <div className="modal-container modal-booking-container">
        <header className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">CONSULTATION SCHEDULING</span>
            <h2 id="booking-modal-title" className="modal-title">
              Schedule a Studio Call
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close scheduling dialog"
            id="close-booking-modal-btn"
          >
            &times;
          </button>
        </header>

        <div className="modal-body">
          {uuid ? (
            <div
              id="mfc-booking-widget"
              data-booking-widget=""
              data-form-uuid={uuid}
              data-api-base={apiBase}
              data-submit-url={submitUrl}
              data-slots-url={slotsUrl}
              data-meeting-title="Consultation Call"
              data-meeting-description="15-minute introductory conversation"
              data-meeting-duration={15}
            />
          ) : (
            <div className="alert-box alert-notice" role="alert">
              <p>
                <strong>Scheduling endpoint is not yet configured.</strong>
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                Please set NEXT_PUBLIC_SCHEDULING_STAGING_URL or NEXT_PUBLIC_FORM_STAGING_URL in your environment (.env.local).
              </p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}
