import React from 'react';
import NavContainer from '~/components/Layout/NavContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy',
};

function PrivacyPolicy() {
  return (
    <NavContainer>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          {/* Add your privacy policy content here */}
          <p>Privacy policy content will be added here.</p>
        </div>
      </div>
    </NavContainer>
  );
}

export default PrivacyPolicy;
