'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from 'next-intl';

interface ServiceAgreementModalProps {
  onAccept: () => void;
}

const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({
  onAccept
}) => {
  const t = useTranslations('serviceAgreement');
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Add small delay to trigger fade-in animation
    setTimeout(() => setShowModal(true), 100);
  }, []);

  return (
    <Dialog open={true}>
      <DialogContent className="p-0 rounded-xl border-none shadow-xl max-w-[800px] w-full overflow-hidden bg-white">
        {/* Remove default close button */}
        <DialogClose className="hidden" />
        
        {/* Header with brand accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2ae8d3] rounded-t-xl"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6">
          <div className="max-h-[350px] overflow-y-auto p-5 bg-white rounded-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-2 h-5 bg-[#f8e43f] rounded mr-2"></span>
              {t('termsAndConditions')}
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <p>{t('welcome')}</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">1.</span> {t('sections.serviceDescription.title')}
              </h4>
              <p>{t('sections.serviceDescription.content')}</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">2.</span> {t('sections.userResponsibilities.title')}
              </h4>
              <p>{t('sections.userResponsibilities.content')}</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">3.</span> {t('sections.privacyPolicy.title')}
              </h4>
              <p>{t('sections.privacyPolicy.content')}</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">4.</span> {t('sections.intellectualProperty.title')}
              </h4>
              <p>{t('sections.intellectualProperty.content')}</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">5.</span> {t('sections.termination.title')}
              </h4>
              <p>{t('sections.termination.content')}</p>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="px-6 mt-5">
          <div 
            className="flex items-center space-x-3 group cursor-pointer" 
            onClick={() => setAgreed(!agreed)}
          >
            <div className="relative">
              <Checkbox 
                id="terms" 
                checked={agreed} 
                onCheckedChange={() => setAgreed(!agreed)}
                className="h-5 w-5 border-2 border-gray-300 rounded-md transition-all duration-300 
                  data-[state=checked]:bg-[#2ae8d3] data-[state=checked]:border-[#2ae8d3]"
              />
            </div>
            <label htmlFor="terms" className="text-gray-700 font-medium cursor-pointer select-none">
              {t('agreement')}
            </label>
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="p-6 mt-4 flex justify-end space-x-4 border-t border-gray-100">
          <Button 
            variant="outline"
            onClick={() => {}}
            className="px-6 py-2 border-2 border-gray-200 text-gray-600 font-medium rounded-lg 
              hover:bg-gray-50 transition-all duration-200"
          >
            {t('decline')}
          </Button>
          <Button 
            onClick={onAccept}
            disabled={!agreed}
            className={`btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${agreed 
                ? 'bg-[#2ae8d3] text-gray-800 hover:bg-[#25d1be]' 
                : 'bg-gray-200 text-gray-500'} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {t('accept')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceAgreementModal;