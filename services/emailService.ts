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
 * Send form submission to n8n webhook
 * n8n will handle sending the email with attachments
 */
export const sendFormSubmissionEmail = async (data: FormSubmissionData): Promise<boolean> => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('n8n webhook URL not configured. Please set N8N_WEBHOOK_URL in environment variables.');
    throw new Error('Email service not configured');
  }

  // Prepare the payload for n8n
  const payload = {
    clientName: data.homeownerName || 'Not provided',
    propertyAddress: data.propertyAddress || 'Not provided',
    phoneNumber: data.phoneNumber || 'Not provided',
    contractorInfo: data.contractorInfo || 'Not provided',
    taskDetails: data.claimsInfo || 'Not provided',
    submissionDate: new Date().toISOString(),
    submissionDateFormatted: new Date().toLocaleString(),
    hasAttachment: !!data.fileName,
    fileName: data.fileName || null,
    fileType: data.fileType || null,
    fileBase64: data.fileBase64 || null,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error:', errorText);
      throw new Error(`Webhook failed: ${response.status}`);
    }

    console.log('Form submitted to n8n successfully');
    return true;
  } catch (error) {
    console.error('Failed to send to n8n webhook:', error);
    throw error;
  }
};

/**
 * Alternative: Send form with file as FormData (multipart)
 * Use this if you prefer handling files as actual file uploads in n8n
 */
export const sendFormWithFileUpload = async (
  data: FormSubmissionData,
  file?: File
): Promise<boolean> => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('n8n webhook URL not configured.');
    throw new Error('Email service not configured');
  }

  const formData = new FormData();
  formData.append('clientName', data.homeownerName || 'Not provided');
  formData.append('propertyAddress', data.propertyAddress || 'Not provided');
  formData.append('phoneNumber', data.phoneNumber || 'Not provided');
  formData.append('contractorInfo', data.contractorInfo || 'Not provided');
  formData.append('taskDetails', data.claimsInfo || 'Not provided');
  formData.append('submissionDate', new Date().toISOString());

  if (file) {
    formData.append('attachment', file);
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send to n8n:', error);
    throw error;
  }
};
