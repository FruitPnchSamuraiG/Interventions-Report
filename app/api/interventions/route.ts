
import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";

const SHEET_ID = "1X484pNIDsDvlO1b5Xi7t4kqewc-rzxSanWxkFtywsFE";
const SHEET_NAME = "Sheet1";

// Load service account credentials from JSON file (not committed to git)
type ServiceAccountCredentials = { client_email: string; private_key: string };
let serviceAccountCredentials: ServiceAccountCredentials;
try {
  serviceAccountCredentials = JSON.parse(fs.readFileSync("interventionsreport-c141dc7077a5.json", "utf8"));
} catch (err) {
  throw new Error("Service account credentials file not found. Please add interventionsreport-c141dc7077a5.json to the project root.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data provided" }, 
        { status: 400 }
      );
    }

    const serviceAccountAuth = new JWT({
      email: serviceAccountCredentials.client_email,
      key: serviceAccountCredentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
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
