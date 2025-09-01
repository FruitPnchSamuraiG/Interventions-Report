
import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { GoogleAuth } from "google-auth-library";

const SHEET_ID = "1X484pNIDsDvlO1b5Xi7t4kqewc-rzxSanWxkFtywsFE";
const SHEET_NAME = "Sheet1";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data provided" }, 
        { status: 400 }
      );
    }


    // Load credentials from environment variable (stringified JSON)
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const authClient = await auth.getClient();

    const doc = new GoogleSpreadsheet(SHEET_ID, authClient);
    await doc.loadInfo();

    console.log("Available sheets:", doc.sheetsByIndex.map(s => s.title));

    const sheet = doc.sheetsByTitle[SHEET_NAME];
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

  await sheet.addRows(body);

  // Explicitly return success after adding rows
  return NextResponse.json({ success: true });
  
  // Extra safety: fallback success response (should never hit)
  // return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Google Sheets API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "An error occurred while updating the spreadsheet" 
      }, 
      { status: 500 }
    );
  }
}
