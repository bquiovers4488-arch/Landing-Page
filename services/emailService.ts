import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const initEmailJS = () => {
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Initialize on module load
initEmailJS();

interface FormSubmissionData {
  homeownerName: string;
  propertyAddress: string;
  phoneNumber: string;
  contractorInfo: string;
  claimsInfo: string;
  fileName?: string;
  fileBase64?: string;
  fileType?: string;
}

/**
 * Send form submission via email with optional file attachment
 * Uses EmailJS for client-side email sending
 */
export const sendFormSubmissionEmail = async (data: FormSubmissionData): Promise<boolean> => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;

  if (!serviceId || !templateId) {
    console.error('EmailJS configuration missing. Please set EMAILJS_SERVICE_ID and EMAILJS_TEMPLATE_ID');
    throw new Error('Email service not configured');
  }

  // Prepare the template parameters
  const templateParams: Record<string, string> = {
    to_email: process.env.RECIPIENT_EMAIL || '',
    from_name: data.homeownerName || 'Not provided',
    client_name: data.homeownerName || 'Not provided',
    property_address: data.propertyAddress || 'Not provided',
    phone_number: data.phoneNumber || 'Not provided',
    contractor_info: data.contractorInfo || 'Not provided',
    task_details: data.claimsInfo || 'Not provided',
    submission_date: new Date().toLocaleString(),
    file_attached: data.fileName ? 'Yes' : 'No',
    file_name: data.fileName || 'None',
  };

  // If there's a file attachment, include it as base64
  // Note: EmailJS has a 50KB limit for attachments in free tier
  // For larger files, we'll include a note about the file
  if (data.fileBase64 && data.fileName) {
    // Check file size (base64 is ~33% larger than original)
    const approximateSize = (data.fileBase64.length * 3) / 4;
    const maxSize = 50 * 1024; // 50KB limit for EmailJS free tier

    if (approximateSize <= maxSize) {
      templateParams.attachment = data.fileBase64;
      templateParams.attachment_name = data.fileName;
      templateParams.attachment_type = data.fileType || 'application/octet-stream';
    } else {
      // File too large for direct attachment
      templateParams.file_note = `File "${data.fileName}" (${(approximateSize / 1024).toFixed(1)}KB) was uploaded but exceeds email attachment limit. Please contact submitter for the file.`;
    }
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log('Email sent successfully:', response.status);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Alternative: Send form data using a FormData approach (for Formspree/Web3Forms)
 * This is a backup method if EmailJS doesn't work well
 */
export const sendFormViaFormspree = async (
  formspreeUrl: string,
  data: FormSubmissionData,
  file?: File
): Promise<boolean> => {
  const formData = new FormData();

  formData.append('Client Name', data.homeownerName);
  formData.append('Property Address', data.propertyAddress);
  formData.append('Phone Number', data.phoneNumber);
  formData.append('Contractor Info', data.contractorInfo);
  formData.append('Task Details', data.claimsInfo);
  formData.append('Submission Date', new Date().toLocaleString());

  if (file) {
    formData.append('attachment', file);
  }

  try {
    const response = await fetch(formspreeUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Form submission failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Formspree submission failed:', error);
    throw error;
  }
};
