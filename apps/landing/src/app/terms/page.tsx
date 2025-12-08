import React from 'react';
import NavContainer from '~/components/Layout/NavContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions',
};

function TermsAndConditions() {
  return (
    <NavContainer>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          {/* Add your terms and conditions content here */}
          <p>Terms and conditions content will be added here.</p>
        </div>
      </div>
    </NavContainer>
  );
}

export default TermsAndConditions;
