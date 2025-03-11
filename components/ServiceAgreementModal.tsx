'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ServiceAgreementModalProps {
  onAccept: () => void;
}

const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({
  onAccept
}) => {
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
            <h2 className="text-2xl font-bold text-gray-800">Service Agreement</h2>
            <p className="text-gray-600 mt-1">Please review our terms before proceeding</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6">
          <div className="max-h-[350px] overflow-y-auto p-5 bg-white rounded-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-2 h-5 bg-[#f8e43f] rounded mr-2"></span>
              Terms & Conditions
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <p>Welcome to our service. By accessing or using our platform, you agree to be bound by these Terms and Conditions.</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">1.</span> Service Description
              </h4>
              <p>Our platform provides tools and resources for [service description]. These services are subject to change at our discretion.</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">2.</span> User Responsibilities
              </h4>
              <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">3.</span> Privacy Policy
              </h4>
              <p>Our Privacy Policy governs the collection, use, and disclosure of personal information we receive from users of our service.</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">4.</span> Intellectual Property
              </h4>
              <p>All content, features, and functionality of our service are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
              
              <h4 className="text-lg font-medium text-gray-800 mt-5 flex items-center">
                <span className="text-[#2ae8d3] mr-2">5.</span> Termination
              </h4>
              <p>We may terminate or suspend your account and access to our service immediately, without prior notice or liability, for any reason.</p>
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
              I have read and agree to the Terms and Conditions
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
            Decline
          </Button>
          <Button 
            onClick={onAccept}
            disabled={!agreed}
            className={`btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${agreed 
                ? 'bg-[#2ae8d3] text-gray-800 hover:bg-[#25d1be]' 
                : 'bg-gray-200 text-gray-500'} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceAgreementModal;