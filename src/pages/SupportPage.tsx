import React from 'react';
import { useLocation } from 'react-router-dom';

export default function SupportPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = '';
  let content = null;

  switch (path) {
    case '/help':
      title = 'Help Center';
      content = (
        <div className="space-y-4">
          <p>Welcome to the Golden Deal Hub Help Center.</p>
          <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>How do I claim a deal?</strong> Click on the "Get Deal" button to be redirected to the offer page.</li>
            <li><strong>Are the deals verified?</strong> We try our best to verify all deals, but prices and availability are subject to change by the retailer.</li>
            <li><strong>Do I need an account?</strong> No, you can browse and claim deals without an account.</li>
          </ul>
        </div>
      );
      break;
    case '/contact':
      title = 'Contact Us';
      content = (
        <div className="space-y-4">
          <p>We'd love to hear from you! Please reach out to us with any questions or feedback.</p>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="mb-2"><strong>Email:</strong> support@goldendealhub.com</p>
            <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Deal Street, Savings City, SC 90210</p>
          </div>
        </div>
      );
      break;
    case '/privacy':
      title = 'Privacy Policy';
      content = (
        <div className="space-y-4">
          <p>At Golden Deal Hub, we take your privacy seriously.</p>
          <p>We do not sell your personal information to third parties. Any email addresses collected for our newsletter are used solely for sending you the latest deals.</p>
          <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
        </div>
      );
      break;
    case '/terms':
      title = 'Terms of Service';
      content = (
        <div className="space-y-4">
          <p>By using Golden Deal Hub, you agree to the following terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We are an aggregator of deals and are not responsible for the fulfillment of orders by third-party retailers.</li>
            <li>Prices and availability are subject to change without notice.</li>
            <li>You agree to use the site for lawful purposes only.</li>
          </ul>
        </div>
      );
      break;
    default:
      title = 'Page Not Found';
      content = <p>The page you are looking for does not exist.</p>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>
          <div className="text-slate-600 leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
