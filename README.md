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

## Email Notifications Setup (EmailJS)

To receive form submissions via email, set up EmailJS:

1. **Create an EmailJS Account:**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up (free tier: 200 emails/month)

2. **Set up Email Service:**
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service" and connect your email provider (Gmail, Outlook, etc.)
   - Note down the **Service ID**

3. **Create an Email Template:**
   - Go to "Email Templates" and click "Create New Template"
   - Use these template variables in your template:
     ```
     Subject: New Task Inquiry from {{client_name}}

     Client Name: {{client_name}}
     Property Address: {{property_address}}
     Phone Number: {{phone_number}}
     Contractor Info: {{contractor_info}}

     Task Details:
     {{task_details}}

     File Attached: {{file_attached}}
     File Name: {{file_name}}
     {{file_note}}

     Submitted: {{submission_date}}
     ```
   - Note down the **Template ID**

4. **Get your Public Key:**
   - Go to "Account" > "API Keys"
   - Copy your **Public Key**

5. **Add to Environment Variables:**
   Add these to your `.env.local` file:
   ```
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PUBLIC_KEY=your_public_key
   RECIPIENT_EMAIL=your@email.com
   ```

6. **Restart the development server** after adding environment variables.
