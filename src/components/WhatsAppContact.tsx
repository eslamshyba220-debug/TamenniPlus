/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface WhatsAppContactProps {
  language: Language;
}

export const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ language }) => {
  const [open, setOpen] = useState(false);
  const isRtl = language === 'ar';

  const supportNumbers = ['+201555523686', '+201551754897'];

  const items = [
    {
      label: isRtl ? 'الدعم الفني' : 'Technical Support',
      text: isRtl ? 'مرحبا، أحتاج مساعدة فنية في طمّني بلس.' : 'Hello, I need technical support for Tamenni Plus.'
    },
    {
      label: isRtl ? 'تسجيل الطبيب' : 'Doctor Registration',
      text: isRtl ? 'مرحبا، أرغب بالتسجيل كطبيب في طمّني بلس.' : 'Hello, I would like to register as a doctor on Tamenni Plus.'
    }
  ];

  return (
    <div className={`fixed bottom-5 ${isRtl ? 'left-5' : 'right-5'} z-50`}> 
      <div className="flex flex-col items-end gap-3">
        {open && (
          <div className="space-y-3 rounded-3xl bg-white border border-border-brand shadow-premium p-4 w-64 text-sm text-text-dark">
            {supportNumbers.map((number) => (
              <a
                key={number}
                href={`https://wa.me/${number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl px-4 py-3 bg-light-gray hover:bg-primary/10 transition-colors"
              >
                <span>{isRtl ? 'واتساب الدعم' : 'WhatsApp Support'}</span>
                <span className="ltr-text inline-block"> • {number}</span>
              </a>
            ))}
            <div className="mt-2 border-t border-border-brand/50 pt-2 text-[11px] text-text-muted">
              {items.map((item) => (
                <div key={item.label} className="mb-1">
                  <a
                    href={`https://wa.me/${supportNumbers[0].replace(/\D/g, '')}?text=${encodeURIComponent(item.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow-premium hover:bg-green-700 transition-all"
          aria-label={isRtl ? 'زر الاتصال بالواتساب' : 'WhatsApp contact button'}
        >
          <MessageSquare size={18} />
          <span className="text-sm font-semibold">{isRtl ? 'واتساب' : 'WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
