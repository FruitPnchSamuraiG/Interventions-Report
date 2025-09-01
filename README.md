# Interventions Report Platform

A Next.js web application for collecting, validating, and storing platform intervention data via CSV upload or manual entry, with Google Sheets integration for backend storage.

## Features

- **CSV Template Download:** Download a ready-to-use CSV template for interventions.
- **CSV Upload & Validation:** Upload your interventions in bulk, with instant validation and feedback.
- **Manual Entry Form:** Add interventions one-by-one with a user-friendly form.
- **Google Sheets Integration:** All valid submissions are appended to a Google Sheet using a service account.
- **Submission Feedback:** Clear UI feedback for validation, submission, and errors.
- **Contact Field:** Every intervention requires a contact email for follow-up.

## Project Structure

```
components/
  InterventionCSVManager.tsx   # Main UI for CSV/form upload and validation
  ui/                         # UI components (buttons, dialogs, etc.)
hooks/                        # Custom React hooks
app/
  page.tsx                    # Main landing page
  contribute/page.tsx         # Dedicated contribution page
  api/interventions/route.ts  # API route for Google Sheets integration
public/                       # Static assets
styles/                       # Global styles
```

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd Interventions-Report
```

### 2. Install Dependencies
```sh
npm install
# or
pnpm install
```

### 3. Add Google Service Account Credentials
- Download your Google service account JSON file.
- Place it in the project root (same folder as `package.json`).
- **Do not commit this file!** It is already in `.gitignore`.

### 4. Set Up Google Sheets
- Share your target Google Sheet with the service account email (found in the JSON file).
- Update `SHEET_ID` and `SHEET_NAME` in `app/api/interventions/route.ts` if needed.

### 5. Run the Development Server
```sh
npm run dev
# or
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment
- For Vercel/Netlify: Use environment variables or a secrets manager to provide the service account credentials (do not commit the JSON file).
- Make sure to set up the credentials file or environment variables in your deployment environment.


## Customization
- To change the required fields or validation, edit `components/InterventionCSVManager.tsx`.
- To change the Google Sheet, update `SHEET_ID` and `SHEET_NAME` in the API route.

## License
MIT

---

For questions or contributions, open an issue or pull request.
