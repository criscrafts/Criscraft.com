# CrisCrafts Google Sheets Order Ledger & Executive Dashboard Setup Guide

This guide explains how to establish a database bridge between your Next.js serverless functions running on Vercel and a Google Sheets document, utilizing Google Apps Script.

The updated script automatically:
1. **Creates dynamic yearly order sheets** (e.g. `Orders 2026`, `Orders 2027`) so orders are neatly organized year by year.
2. **Auto-generates an Executive Dashboard** displaying Total Lifetime Revenue, Current Year Sales, Orders Count, Average Order Value (AOV), and Regional Sales (Inside vs. Outside Valley).
3. **Adds a custom toolbar menu** (`CrisCrafts Studio 🎨`) inside Google Sheets to refresh metrics, format sheets, or create new yearly tabs with one click.

---

## Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a brand new blank spreadsheet.
2. Rename the spreadsheet to **CrisCrafts Orders**.
3. You do not need to manually add columns or tabs — the script will auto-create `Orders 2026` and `Executive Dashboard` tabs on the first order or upon running the setup menu!

---

## Step 2: Set Up Google Apps Script
1. In your Google Sheet, select **Extensions** > **Apps Script** from the top menu.
2. Delete any boilerplate code inside the editor (`Code.gs`) and paste the following code:

```javascript
/**
 * CrisCrafts Artisan Boutique — Google Apps Script Order Ledger & Executive Dashboard
 * 
 * Features:
 * 1. Automatically creates yearly ledger sheets (e.g. "Orders 2026", "Orders 2027").
 * 2. Appends incoming orders with full customer info, item details, custom specs, and region data.
 * 3. Initializes an Executive Dashboard sheet with automated formulas for Sales, Orders, AOV, and Regional Breakdown.
 * 4. Adds a custom "CrisCrafts Studio 🎨" menu toolbar to refresh metrics and create new yearly tabs with one click.
 */

// Custom Menu Trigger on Sheet Open
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CrisCrafts Studio 🎨')
    .addItem('🔄 Refresh Dashboard Metrics', 'refreshDashboardMetrics')
    .addItem('➕ Create New Year Sheet', 'promptNewYearSheet')
    .addSeparator()
    .addItem('🎨 Format All Order Sheets', 'formatAllOrderSheets')
    .addToUi();
}

/**
 * Handles incoming HTTP POST requests from Next.js serverless route (/api/checkout)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for lock to avoid race conditions
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
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var currentYear = new Date().getFullYear();
    var sheetName = "Orders " + currentYear;
    
    var sheet = getOrCreateYearSheet(ss, sheetName);
    
    var timestamp = new Date();
    var shippingRegion = data.shippingMethod === "outside-valley" 
      ? "Outside Valley (Rs. 250)" 
      : "Inside Valley (Rs. 150)";
      
    // Append order row
    sheet.appendRow([
      data.orderId,
      timestamp,
      data.customerName,
      "'" + data.phone, // Lead quote preserves phone formatting
      data.address,
      shippingRegion,
      data.productSummary || "Standard Order",
      Number(data.subtotal || 0),
      Number(data.shippingCost || 0),
      Number(data.total || 0),
      data.paymentMethod || "WhatsApp Payment",
      "WhatsApp Pending", // Default Order Status
      data.notes || ""
    ]);
    
    // Format currency columns
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(lastRow, 8, 1, 3).setNumberFormat("Rs. #,##0");
      sheet.getRange(lastRow, 2).setNumberFormat("yyyy-mm-dd hh:mm");
    }
    
    // Auto-update Executive Dashboard
    updateExecutiveDashboard(ss);
    
    lock.releaseLock();
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, orderId: data.orderId, yearSheet: sheetName })
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

/**
 * Gets or creates a yearly order sheet with styled headers
 */
function getOrCreateYearSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Create Header Row
    var headers = [
      "Order ID",
      "Date & Time",
      "Customer Name",
      "Phone Number",
      "Shipping Address",
      "Shipping Region",
      "Products & Customizations Summary",
      "Subtotal (Rs.)",
      "Shipping Fee (Rs.)",
      "Total Amount (Rs.)",
      "Payment Method",
      "Order Status",
      "Customer Notes"
    ];
    
    sheet.appendRow(headers);
    
    // Style Header Row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1E293B")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setFontFamily("Georgia")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");
               
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
    
    // Auto column widths
    sheet.setColumnWidth(1, 150); // Order ID
    sheet.setColumnWidth(2, 140); // Date
    sheet.setColumnWidth(3, 160); // Customer Name
    sheet.setColumnWidth(4, 130); // Phone
    sheet.setColumnWidth(5, 220); // Address
    sheet.setColumnWidth(6, 160); // Region
    sheet.setColumnWidth(7, 300); // Products Details
    sheet.setColumnWidth(8, 120); // Subtotal
    sheet.setColumnWidth(9, 120); // Shipping Fee
    sheet.setColumnWidth(10, 130); // Total Amount
    sheet.setColumnWidth(11, 180); // Payment Method
    sheet.setColumnWidth(12, 140); // Order Status
    sheet.setColumnWidth(13, 200); // Notes
  }
  return sheet;
}

/**
 * Creates and updates the Executive Dashboard sheet
 */
function updateExecutiveDashboard(ss) {
  var ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName("Executive Dashboard");
  
  if (!dash) {
    dash = ss.insertSheet("Executive Dashboard", 0);
  }
  
  dash.clear();
  dash.setHiddenGridlines(false);
  
  // Dashboard Title Banner
  dash.getRange("A1:I1").merge()
      .setValue("🎨 CRISCRAFTS ARTISAN BOUTIQUE — EXECUTIVE DASHBOARD")
      .setBackground("#1E293B")
      .setFontColor("#FCFBF7")
      .setFontSize(14)
      .setFontWeight("bold")
      .setFontFamily("Georgia")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
  dash.setRowHeight(1, 45);
  
  // Current Year & Lifetime Stats
  var currentYear = new Date().getFullYear();
  var yearSheetName = "Orders " + currentYear;
  
  // KPI Header Cards Row
  dash.getRange("A3").setValue("TOTAL LIFETIME REVENUE").setFontWeight("bold").setFontSize(9).setFontColor("#475569");
  dash.getRange("C3").setValue("TOTAL ORDERS COUNT").setFontWeight("bold").setFontSize(9).setFontColor("#475569");
  dash.getRange("E3").setValue(currentYear + " REVENUE").setFontWeight("bold").setFontSize(9).setFontColor("#475569");
  dash.getRange("G3").setValue("AVG ORDER VALUE (AOV)").setFontWeight("bold").setFontSize(9).setFontColor("#475569");
  
  // Formulas for KPIs
  var sheets = ss.getSheets();
  var orderSheets = sheets.filter(function(s) {
    return s.getName().indexOf("Orders ") === 0;
  });
  
  // Set up formula to sum across all order tabs
  if (orderSheets.length > 0) {
    var revenueFormulaParts = [];
    var countFormulaParts = [];
    
    orderSheets.forEach(function(s) {
      var name = "'" + s.getName() + "'";
      revenueFormulaParts.push("SUM(" + name + "!J2:J)");
      countFormulaParts.push("COUNTA(" + name + "!A2:A)");
    });
    
    dash.getRange("A4").setFormula("=" + revenueFormulaParts.join("+"));
    dash.getRange("C4").setFormula("=" + countFormulaParts.join("+"));
    
    // Current year formula
    var currentYearSheet = ss.getSheetByName(yearSheetName);
    if (currentYearSheet) {
      dash.getRange("E4").setFormula("=SUM('" + yearSheetName + "'!J2:J)");
    } else {
      dash.getRange("E4").setValue(0);
    }
    
    // Average Order Value Formula
    dash.getRange("G4").setFormula("=IF(C4>0, A4/C4, 0)");
  } else {
    dash.getRange("A4").setValue(0);
    dash.getRange("C4").setValue(0);
    dash.getRange("E4").setValue(0);
    dash.getRange("G4").setValue(0);
  }
  
  // Format KPI Number Cells
  dash.getRange("A4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#3B79C6");
  dash.getRange("C4").setFontSize(16).setFontWeight("bold").setNumberFormat("#,##0").setFontColor("#1E293B");
  dash.getRange("E4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#3B79C6");
  dash.getRange("G4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#D4B26F");
  
  // Region Breakdown Table
  dash.getRange("A7:D7").merge()
      .setValue("REGIONAL SALES DISTRIBUTION")
      .setBackground("#F5EFE6")
      .setFontWeight("bold")
      .setFontColor("#1E293B");
      
  dash.getRange("A8").setValue("Region").setFontWeight("bold");
  dash.getRange("B8").setValue("Orders Count").setFontWeight("bold");
  dash.getRange("C8").setValue("Total Sales (Rs.)").setFontWeight("bold");
  dash.getRange("D8").setValue("Share (%)").setFontWeight("bold");
  
  if (orderSheets.length > 0) {
    var insideCountParts = [];
    var outsideCountParts = [];
    var insideSumParts = [];
    var outsideSumParts = [];
    
    orderSheets.forEach(function(s) {
      var n = "'" + s.getName() + "'";
      insideCountParts.push("COUNTIF(" + n + "!F2:F, \"*Inside Valley*\")");
      outsideCountParts.push("COUNTIF(" + n + "!F2:F, \"*Outside Valley*\")");
      insideSumParts.push("SUMIF(" + n + "!F2:F, \"*Inside Valley*\", " + n + "!J2:J)");
      outsideSumParts.push("SUMIF(" + n + "!F2:F, \"*Outside Valley*\", " + n + "!J2:J)");
    });
    
    dash.getRange("A9").setValue("Inside Valley");
    dash.getRange("B9").setFormula("=" + insideCountParts.join("+"));
    dash.getRange("C9").setFormula("=" + insideSumParts.join("+")).setNumberFormat("Rs. #,##0");
    dash.getRange("D9").setFormula("=IF(C4>0, C9/A4, 0)").setNumberFormat("0.0%");
    
    dash.getRange("A10").setValue("Outside Valley");
    dash.getRange("B10").setFormula("=" + outsideCountParts.join("+"));
    dash.getRange("C10").setFormula("=" + outsideSumParts.join("+")).setNumberFormat("Rs. #,##0");
    dash.getRange("D10").setFormula("=IF(C4>0, C10/A4, 0)").setNumberFormat("0.0%");
  }
  
  // Yearly Ledger Tabs Summary Table
  dash.getRange("F7:I7").merge()
      .setValue("YEARLY SALES LEDGER BREAKDOWN")
      .setBackground("#F5EFE6")
      .setFontWeight("bold")
      .setFontColor("#1E293B");
      
  dash.getRange("F8").setValue("Year Tab").setFontWeight("bold");
  dash.getRange("G8").setValue("Total Orders").setFontWeight("bold");
  dash.getRange("H8").setValue("Revenue (Rs.)").setFontWeight("bold");
  dash.getRange("I8").setValue("Avg Order (Rs.)").setFontWeight("bold");
  
  orderSheets.forEach(function(s, idx) {
    var r = 9 + idx;
    var name = "'" + s.getName() + "'";
    dash.getRange(r, 6).setValue(s.getName());
    dash.getRange(r, 7).setFormula("=COUNTA(" + name + "!A2:A)");
    dash.getRange(r, 8).setFormula("=SUM(" + name + "!J2:J)").setNumberFormat("Rs. #,##0");
    dash.getRange(r, 9).setFormula("=IF(G" + r + ">0, H" + r + "/G" + r + ", 0)").setNumberFormat("Rs. #,##0");
  });
  
  // Adjust column widths
  dash.setColumnWidth(1, 160);
  dash.setColumnWidth(2, 130);
  dash.setColumnWidth(3, 160);
  dash.setColumnWidth(4, 120);
  dash.setColumnWidth(5, 30);
  dash.setColumnWidth(6, 140);
  dash.setColumnWidth(7, 130);
  dash.setColumnWidth(8, 150);
  dash.setColumnWidth(9, 140);
}

// Menu actions
function refreshDashboardMetrics() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  updateExecutiveDashboard(ss);
  SpreadsheetApp.getUi().alert("✅ Executive Dashboard metrics successfully refreshed!");
}

function promptNewYearSheet() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Create New Year Sheet', 'Enter Year (e.g., 2027):', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) {
    var yearStr = response.getResponseText().trim();
    if (yearStr && !isNaN(yearStr)) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheetName = "Orders " + yearStr;
      getOrCreateYearSheet(ss, sheetName);
      updateExecutiveDashboard(ss);
      ui.alert("✨ Created new ledger sheet: " + sheetName);
    } else {
      ui.alert("⚠️ Please enter a valid 4-digit year.");
    }
  }
}

function formatAllOrderSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  sheets.forEach(function(s) {
    if (s.getName().indexOf("Orders ") === 0) {
      getOrCreateYearSheet(ss, s.getName());
    }
  });
  updateExecutiveDashboard(ss);
  SpreadsheetApp.getUi().alert("✨ All Order Sheets formatted successfully!");
}
```

3. Save the script project (`Ctrl + S`).

---

## Step 3: Deploy as a Web Application
1. Click the blue **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure settings:
   - **Description**: `CrisCrafts Multi-Year Webhook Bridge v2`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Grant permissions if prompted by clicking **Authorize access** > **Advanced** > **Go to Project (unsafe)**.
6. Copy the generated **Web app URL**:
   `https://script.google.com/macros/s/.../exec`

---

## Step 4: Add Webhook URL to Next.js
In your Next.js `.env.local` file (and Vercel Production Environment Variables):

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
```

Your web app will now automatically log orders into yearly ledger sheets and continuously populate the Executive Dashboard!
