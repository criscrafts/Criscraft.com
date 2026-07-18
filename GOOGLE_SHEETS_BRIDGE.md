# CrisCrafts Google Sheets Order Ledger Setup Guide

This guide explains how to establish a secure database bridge between your Next.js serverless functions running on Vercel and a Google Sheets document, utilizing Google Apps Script.

---

## Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.google.) and create a brand new blank spreadsheet.
2. Rename the spreadsheet to **CrisCrafts Orders**.
3. Rename the active sheet tab (at the bottom left) from `Sheet1` to `Orders`.
4. Add the following column headers in row `1` (cells `A1` to `L1`):
   - **Column A**: `Order ID`
   - **Column B**: `Timestamp`
   - **Column C**: `Customer Name`
   - **Column D**: `Phone`
   - **Column E**: `Shipping Address`
   - **Column F**: `Products Details`
   - **Column G**: `Subtotal (Rs.)`
   - **Column H**: `Shipping Cost (Rs.)`
   - **Column I**: `Total Amount (Rs.)`
   - **Column J**: `Payment Method`
   - **Column K**: `Notes`
   - **Column L**: `Status`

---

## Step 2: Set Up Google Apps Script
1. In your Google Sheet, select **Extensions** > **Apps Script** from the top menu.
2. Delete any boilerplate code inside the editor (`Code.gs`) and paste the following Javascript code:

```javascript
/**
 * Handles secure webhook requests from Vercel Serverless Functions.
 * Appends orders to the Google Sheets spreadsheet.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait for lock to prevent simultaneous write race conditions
    lock.waitLock(10000);
    
    var data = JSON.parse(e.postData.contents);
    
    // Server-side validation
    if (!data.orderId || !data.customerName || !data.phone || !data.address) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Missing required fields: orderId, customerName, phone, or address" })
      )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
    }
    
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = activeSpreadsheet.getSheetByName("Orders");
    
    // Auto-create sheets if sheet was deleted or renamed
    if (!sheet) {
      sheet = activeSpreadsheet.insertSheet("Orders");
      sheet.appendRow(["Order ID", "Timestamp", "Customer Name", "Phone", "Shipping Address", "Products Details", "Subtotal (Rs.)", "Shipping Cost (Rs.)", "Total Amount (Rs.)", "Payment Method", "Notes", "Status"]);
    }
    
    // Append Order Payload
    sheet.appendRow([
      data.orderId,
      new Date(),
      data.customerName,
      data.phone,
      data.address,
      data.productSummary,
      data.subtotal,
      data.shippingCost,
      data.total,
      data.paymentMethod,
      data.notes || "",
      "Pending Verification" // Initial order status
    ]);
    
    // Release lock
    lock.releaseLock();
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, orderId: data.orderId })
    )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
    
  } catch (error) {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}

/**
 * Handle CORS preflight options requests.
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

3. Save the script project (click the disk icon or press `Ctrl + S`).

---

## Step 3: Deploy as a Web Application
1. Click the blue **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the following settings:
   - **Description**: `CrisCrafts Webhook Bridge v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` (this allows Vercel serverless requests to communicate with the sheet).
4. Click **Deploy**.
5. Google will prompt you to **Authorize Access**. Click "Authorize access", sign into your Google account, click "Advanced", and click "Go to Untitled project (unsafe)" to grant write permissions.
6. Once deployed, copy the **Web app URL** from the success popup. It will look like this:
   `https://script.google.com/macros/s/AKfycb..._ws_dE/exec`

---

## Step 4: Add Environment Variable in Vercel
In your Next.js project root `.env.local` file (or inside the Vercel Dashboard for production), add the copied URL:

```env
# Secret order hook endpoint
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycb..._ws_dE/exec
```

Your Next.js serverless route handler (`app/api/checkout/route.ts`) will now securely pipe new order entries directly to your spreadsheet!
