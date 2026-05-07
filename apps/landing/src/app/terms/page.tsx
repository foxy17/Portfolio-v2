import React from 'react';
import NavContainer from '~/components/Layout/NavContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Back2Me',
  description: 'Terms and Conditions for Back2Me app',
};

function TermsAndConditions() {
  return (
    <NavContainer>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms &amp; Conditions</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            These terms and conditions apply to the Back2Me app (hereby referred
            to as &quot;Application&quot;) for mobile devices that was created
            by Arnav Chauhan (hereby referred to as &quot;Service
            Provider&quot;) as a Free service.
          </p>

          <p>
            <strong>Effective Date:</strong> December 8, 2025
          </p>

          <p>
            Upon downloading or utilizing the Application, you are automatically
            agreeing to the following terms. It is strongly advised that you
            thoroughly read and understand these terms prior to using the
            Application.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            Unauthorized copying, modification of the Application, any part of
            the Application, or our trademarks is strictly prohibited. Any
            attempts to extract the source code of the Application, translate
            the Application into other languages, or create derivative versions
            are not permitted. All trademarks, copyrights, database rights, and
            other intellectual property rights related to the Application remain
            the property of the Service Provider.
          </p>

          <h2>Offline Functionality</h2>
          <p>
            <strong>The Application operates completely offline.</strong> No
            internet connection is required to use any features of the
            Application. All data is stored locally on your device and is never
            transmitted to external servers or services.
          </p>

          <h2>Device Security and Data Responsibility</h2>
          <p>
            The Application stores personal data locally on your device,
            including records of items lent or borrowed, contact information,
            photos, and notes. It is your responsibility to:
          </p>
          <ul>
            <li>
              Maintain the security of your phone and access to the Application
            </li>
            <li>
              Protect your device with appropriate security measures (lock
              screen, password, etc.)
            </li>
            <li>Keep backups of your data if desired</li>
            <li>
              Ensure your device has sufficient storage space for the
              Application to function properly
            </li>
          </ul>

          <p>
            The Service Provider strongly advises against jailbreaking or
            rooting your phone, which involves removing software restrictions
            and limitations imposed by the official operating system of your
            device. Such actions could expose your phone to malware, viruses,
            malicious programs, compromise your phone&apos;s security features,
            and may result in the Application not functioning correctly or at
            all.
          </p>

          <h2>User-Generated Content and Sharing</h2>
          <p>
            <strong>Important:</strong> You are solely responsible for any
            content you create, share, or copy from the Application. The
            Application allows you to:
          </p>
          <ul>
            <li>
              Create messages, notes, and reminders about items lent or borrowed
            </li>
            <li>
              Copy or share these messages using your device&apos;s sharing
              functionality
            </li>
          </ul>

          <p>By using the Application, you acknowledge and agree that:</p>
          <ul>
            <li>
              You are responsible for the content, tone, and language of any
              messages you create
            </li>
            <li>
              The Service Provider is not responsible for any consequences
              arising from messages you share or copy from the Application
            </li>
            <li>
              Any disputes, conflicts, or relationship issues resulting from
              shared content are your sole responsibility
            </li>
            <li>
              You should exercise discretion and good judgment when sharing
              content that may affect your personal relationships
            </li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>The Service Provider cannot be held responsible for:</p>
          <ul>
            <li>
              Loss of data due to device failure, corruption, theft, or user
              error
            </li>
            <li>
              Any consequences of messages or content you share from the
              Application
            </li>
            <li>
              Disputes arising from lending or borrowing transactions tracked in
              the Application
            </li>
            <li>Your device running out of battery or storage space</li>
            <li>
              Incompatibility with modified or non-standard device operating
              systems
            </li>
          </ul>

          <p>
            The Application is provided as a tool to help you track your
            personal lending and borrowing activities. The Service Provider
            makes no guarantees about the recovery of debts, resolution of
            disputes, or maintenance of relationships based on information
            tracked in the Application.
          </p>

          <h2>Accuracy and Updates</h2>
          <p>
            While the Service Provider strives to ensure that the Application
            functions correctly and efficiently, the Application is provided
            &quot;AS IS&quot; without warranty of any kind. The Service Provider
            accepts no liability for any loss, direct or indirect, that you
            experience as a result of using the Application.
          </p>

          <h2>Modifications to the Application</h2>
          <p>
            The Service Provider is dedicated to ensuring that the Application
            is as beneficial and efficient as possible. As such, they reserve
            the right to modify the Application or charge for their services at
            any time and for any reason. The Service Provider assures you that
            any charges for the Application or its services will be clearly
            communicated to you in advance.
          </p>

          <h2>Application Updates</h2>
          <p>
            The Service Provider may wish to update the Application at some
            point. The Application is currently available as per the
            requirements for your device&apos;s operating system. These
            requirements may change, and you will need to download the updates
            if you want to continue using the Application. The Service Provider
            does not guarantee that it will always update the Application so
            that it is relevant to you and/or compatible with the particular
            operating system version installed on your device. However, you
            agree to always accept updates to the Application when offered to
            you.
          </p>

          <h2>Termination</h2>
          <p>
            The Service Provider may also wish to cease providing the
            Application and may terminate its use at any time without providing
            termination notice to you. Unless they inform you otherwise, upon
            any termination:
          </p>
          <ul>
            <li>
              The rights and licenses granted to you in these terms will end
            </li>
            <li>
              You must cease using the Application, and (if necessary) delete it
              from your device
            </li>
          </ul>

          <p>
            <strong>Note:</strong> Uninstalling the Application will permanently
            delete all locally stored data. Ensure you have backed up any
            important information before uninstalling.
          </p>

          <h2>Permissions</h2>
          <p>
            By using the Application, you grant permission for the Application
            to access:
          </p>
          <ul>
            <li>Contacts - to link contacts to lending/borrowing records</li>
            <li>Storage - to save your records locally</li>
            <li>Camera - to photograph items for your records</li>
            <li>Photos/Media - to attach existing photos to records</li>
          </ul>
          <p>
            These permissions are used solely for local functionality. No data
            accessed through these permissions is transmitted outside your
            device.
          </p>

          <h2>Changes to These Terms and Conditions</h2>
          <p>
            The Service Provider may periodically update their Terms and
            Conditions. Therefore, you are advised to review this page regularly
            for any changes. The Service Provider will notify you of any changes
            by posting the new Terms and Conditions on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions or suggestions about the Terms and
            Conditions, please do not hesitate to contact the Service Provider
            at{' '}
            <a href="mailto:reach.grubmath@gmail.com">
              reach.grubmath@gmail.com
            </a>
            .
          </p>

          <hr />
          <p>
            <small>
              This Terms and Conditions page was generated by{' '}
              <a
                href="https://app-privacy-policy-generator.nisrulz.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                App Privacy Policy Generator
              </a>{' '}
              and modified to reflect the Application&apos;s offline
              functionality.
            </small>
          </p>
        </div>
      </div>
    </NavContainer>
  );
}

export default TermsAndConditions;
