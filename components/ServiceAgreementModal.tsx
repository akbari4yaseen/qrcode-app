'use client';

import React from 'react';

interface ServiceAgreementModalProps {
  onAccept: () => void;
}

const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Service Agreement</h2>
        <p className="mb-4">
          Please read and accept our service agreement to continue.
        </p>
        {/* Optionally, include a link to your full agreement */}
        <div className="flex justify-end">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAgreementModal;
