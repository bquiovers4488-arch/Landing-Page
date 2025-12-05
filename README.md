<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14o3VAs9CdTy-x9jvHGK_ehLWYeqLIjLf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Email Notifications Setup (n8n)

Form submissions are sent to an n8n webhook which handles email notifications with file attachments.

### n8n Workflow Setup

1. **Create an n8n Webhook:**
   - In n8n, create a new workflow
   - Add a "Webhook" node as the trigger
   - Set HTTP Method to `POST`
   - Copy the webhook URL (Production or Test URL)

2. **Add to Environment Variables:**
   Add to your `.env.local` file:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
   ```

3. **Configure the n8n Workflow:**
   The webhook receives this JSON payload:
   ```json
   {
     "clientName": "John Doe",
     "propertyAddress": "123 Main St",
     "phoneNumber": "(555) 123-4567",
     "contractorInfo": "ABC Company",
     "taskDetails": "Task description...",
     "submissionDate": "2024-01-15T10:30:00.000Z",
     "submissionDateFormatted": "1/15/2024, 10:30:00 AM",
     "hasAttachment": true,
     "fileName": "document.pdf",
     "fileType": "application/pdf",
     "fileBase64": "base64-encoded-file-data..."
   }
   ```

4. **Example n8n Workflow Nodes:**
   - **Webhook** (trigger) - Receives form data
   - **Set** (optional) - Transform/format data
   - **Send Email** - Configure with your email provider (Gmail, SMTP, etc.)
     - Use expressions like `{{ $json.clientName }}` in the email body
     - For attachments: decode base64 and attach file

5. **Handling File Attachments in n8n:**
   - Add a "Code" node to decode base64:
     ```javascript
     if ($json.fileBase64) {
       return {
         binary: {
           attachment: {
             data: $json.fileBase64,
             fileName: $json.fileName,
             mimeType: $json.fileType
           }
         },
         json: $json
       };
     }
     return { json: $json };
     ```
   - In the Send Email node, add the binary attachment

6. **Restart the development server** after adding environment variables.
