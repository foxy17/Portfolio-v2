import React from 'react';
import NavContainer from '~/components/Layout/NavContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Back2Me',
  description: 'Privacy Policy for Back2Me app',
};

function PrivacyPolicy() {
  return (
    <NavContainer>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            This privacy policy applies to the Back2Me app (hereby referred to
            as &quot;Application&quot;) for mobile devices that was created by
            Arnav Chauhan (hereby referred to as &quot;Service Provider&quot;)
            as a Free service. This service is intended for use &quot;AS
            IS&quot;.
          </p>

          <p>
            <strong>Effective Date:</strong> December 8, 2025
          </p>

          <h2>Offline Operation</h2>
          <p>
            <strong>Back2Me is a completely offline application.</strong> All
            data remains on your device and is never transmitted to any external
            servers, third-party services, or online services. The app does not
            require an internet connection to function and does not collect,
            transmit, or share any of your personal information online.
          </p>

          <h2>Data Storage</h2>
          <p>
            All information you enter into the Application, including records of
            items lent or borrowed, contact information, photos, and notes, is
            stored locally on your device only. This data is not accessible to
            the Service Provider or any third parties.
          </p>

          <h2>Permissions Required</h2>
          <p>
            The Application requires the following permissions to function
            properly. These permissions are used solely for local functionality
            on your device:
          </p>

          <ul>
            <li>
              <strong>Contacts:</strong> To allow you to easily select and link
              contacts to lending/borrowing records. Contact information is only
              accessed and stored locally on your device.
            </li>
            <li>
              <strong>Storage:</strong> To save your lending and borrowing
              records, and to back up and restore your data locally on your
              device.
            </li>
            <li>
              <strong>Camera:</strong> To take photos of items you are lending
              or borrowing for your records.
            </li>
            <li>
              <strong>Photos/Media:</strong> To attach existing photos from your
              device to your lending and borrowing records.
            </li>
          </ul>

          <p>
            No data accessed through these permissions is ever transmitted
            outside your device.
          </p>

          <h2>No Account or Login Required</h2>
          <p>
            The Application does not require you to create an account or log in.
            There is no collection of email addresses, usernames, passwords, or
            any other personal identification information.
          </p>

          <h2>User-Generated Content and Liability</h2>
          <p>
            <strong>Important Notice:</strong> The Application allows you to
            create messages, notes, and reminders related to items you have lent
            or borrowed. You have the ability to copy or share these messages
            through your device&apos;s sharing functionality.
          </p>

          <p>
            <strong>
              You are solely responsible for any content you choose to share or
              copy from the Application.
            </strong>{' '}
            The Service Provider is not responsible for:
          </p>
          <ul>
            <li>The content of messages you create within the Application</li>
            <li>
              Any messages, notes, or information you choose to share or copy
              from the Application to other people or platforms
            </li>
            <li>
              Any consequences, disputes, or relationship issues that may arise
              from sharing or copying content from the Application
            </li>
            <li>
              The tone, language, or nature of any communications you send using
              content from the Application
            </li>
          </ul>

          <p>
            Please exercise discretion and judgment when sharing or copying any
            content from the Application, as such actions may affect your
            personal relationships.
          </p>

          <h2>Third Party Access</h2>
          <p>
            The Application does not share any data with third parties. Since
            the Application operates entirely offline, no information is
            transmitted to external services, analytics providers, advertisers,
            or any other third parties.
          </p>

          <h2>Data Security</h2>
          <p>
            Your data security is dependent on your device&apos;s security. The
            Service Provider recommends that you:
          </p>
          <ul>
            <li>Use a secure lock screen on your device</li>
            <li>Keep your device&apos;s operating system updated</li>
            <li>Be cautious about who has physical access to your device</li>
          </ul>

          <h2>Opt-Out Rights</h2>
          <p>
            You can stop all use of the Application and delete all associated
            data by uninstalling it through the standard uninstall processes
            available on your mobile device or via the mobile application
            marketplace.
          </p>

          <p>
            <strong>Note:</strong> Uninstalling the Application will permanently
            delete all your local data, including all lending and borrowing
            records. Make sure to back up any important information before
            uninstalling.
          </p>

          <h2>Data Retention</h2>
          <p>
            All data remains on your device for as long as the Application is
            installed. The Service Provider does not have access to your data
            and cannot delete it remotely. To delete your data, simply uninstall
            the Application from your device.
          </p>

          <h2>Children</h2>
          <p>
            The Service Provider does not knowingly collect personally
            identifiable information from children under the age of 13. Since
            the Application operates entirely offline and stores data only on
            your device, the Service Provider has no access to any user data,
            regardless of age.
          </p>

          <p>
            Parents and legal guardians should monitor their children&apos;s use
            of the Application. You must be at least 16 years of age to consent
            to the processing of your personally identifiable information in
            your country (in some countries we may allow your parent or guardian
            to do so on your behalf).
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes to the Privacy
            Policy by updating this page with the new Privacy Policy. You are
            advised to consult this Privacy Policy regularly for any changes, as
            continued use is deemed approval of all changes.
          </p>

          <h2>Your Consent</h2>
          <p>
            By using the Application, you are consenting to the processing of
            your information as set forth in this Privacy Policy now and as
            amended by us.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding privacy while using the
            Application, or have questions about the practices, please contact
            the Service Provider via email at{' '}
            <a href="mailto:reach.grubmath@gmail.com">
              reach.grubmath@gmail.com
            </a>
            .
          </p>

          <hr />
        </div>
      </div>
    </NavContainer>
  );
}

export default PrivacyPolicy;
