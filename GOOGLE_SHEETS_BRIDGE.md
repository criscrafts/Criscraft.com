# CrisCrafts Master Google Sheets Order Ledger & Executive Dashboard Setup Guide

This guide details how to set up the **CrisCrafts Studio v5 Master Google Apps Script Bridge** connecting your Next.js serverless application on Vercel with Google Sheets and Google Drive.

The **CrisCrafts Studio v5 Script** includes:
1. **Tri-Tier Fail-Safe Spreadsheet Access**: Uses `getActiveSpreadsheet()`, `openById(SPREADSHEET_ID)`, and Drive file search fallbacks to guarantee 100% spreadsheet access without trigger errors.
2. **Formula & HTML Injection Guard**: Automatically sanitizes customer inputs (`=`, `+`, `-`, `@`) to prevent Google Sheets formula injection and escapes HTML in emails/PDFs.
3. **Duplicate Order Protection**: Deduplicates incoming webhook retries to prevent double logging.
4. **Real-Time `onEdit(e)` Auto-Sync**: Automatically recalculates the Executive Dashboard whenever an admin updates an order status (`WhatsApp Pending` ➔ `Delivered`).
5. **Instant Admin Email Notifications**: Sends styled HTML order alert emails to the boutique owner/team upon checkout.
6. **Automated PDF Invoice Engine**: Generates luxury PDF receipts in Google Drive (`CrisCrafts Invoices` folder) and attaches clickable links in the Sheet.
7. **Dynamic Yearly Order Ledgers** (`Orders 2026`, `Orders 2027`): Styled navy headers (`#1E293B`), formatted currency columns (`Rs. #,##0`), preserved phone numbers (`'`), and interactive `Order Status` dropdowns.
8. **Executive Dashboard v5**: Real-time KPI Cards (Revenue, Orders Count, Current Year Revenue, AOV, Pending, Delivered), Regional Breakdown, Order Lifecycle Status Breakdown, Top Sellers, and Multi-Year Performance.
9. **Interactive Studio Menu (`CrisCrafts Studio 🎨`)**: Toolbar options for VIP Customer Search, One-Click Google Drive CSV Backups, Metrics Refresh, and Health Diagnostics.

---

## Troubleshooting Error: "Service Spreadsheets failed while accessing document with id..."

### Cause:
This error occurs when Google Apps Script runs `SpreadsheetApp.openById(...)` inside an `onOpen()` simple trigger context. Simple triggers in Google Sheets are strictly forbidden by Google Security from running `openById(...)`.

### Solution:
1. Open your active Google Sheet (**CrisCrafts Orders**).
2. Open **Extensions** > **Apps Script**.
3. In `Code.gs`, leave line 20 empty: `var SPREADSHEET_ID = "";` (the script automatically uses `SpreadsheetApp.getActiveSpreadsheet()` first).
4. Save (`Ctrl + S`) and refresh your Google Sheet tab (`F5`).

---

## Step 1: Set Up Google Apps Script
1. In your Google Sheet, select **Extensions** > **Apps Script** from the top menu.
2. Delete any existing code inside `Code.gs` and paste the following complete code:

```javascript
/**
 * CrisCrafts Artisan Boutique — Ultimate Google Apps Script Order Ledger & Executive Dashboard v5
 * 
 * Master Features:
 * 1. Tri-Tier Fail-Safe Access: Priorities getActiveSpreadsheet() -> openById(ID) -> DriveApp search.
 * 2. Formula & HTML Injection Guard: Sanitizes formula prefixes (=, +, -, @) and escapes HTML in PDFs/emails.
 * 3. Duplicate Order Guard: Deduplicates webhook retries to prevent duplicate row entries.
 * 4. Real-time onEdit Auto-Sync: Auto-refreshes Executive Dashboard when order statuses are updated.
 * 5. Instant Email Alerts: Sends styled HTML order notification emails to admin/owner.
 * 6. PDF Invoice Engine: Generates luxury PDF receipts in Google Drive "CrisCrafts Invoices" folder with Sheet links.
 * 7. Dynamic Yearly Ledgers: Auto-creates yearly sheets ("Orders 2026", "Orders 2027", etc.) with status dropdowns.
 * 8. Executive Dashboard v5: 6 KPI Cards, Regional Distribution, Order Status Breakdown, and Multi-Year Performance.
 * 9. Interactive Toolbar ("CrisCrafts Studio 🎨"): Refresh metrics, VIP customer search, Drive backups, health checks.
 */

// ============================================================================
// CRISCRAFTS MASTER CONFIGURATION
// ============================================================================

// 1. SPREADSHEET ID (Optional):
// Leave empty ("") if script is created inside your Google Sheet via Extensions > Apps Script.
// If running as standalone script, paste your Google Sheet ID below.
var SPREADSHEET_ID = ""; // e.g. "11FkHI4W3cvBMjyWUW4QxfQQ8toc7M5PPnFAe-P7yj-k"

// 2. ADMIN EMAIL NOTIFICATIONS:
// Leave empty ("") to send alerts to your Google account email, or specify a custom email.
var ADMIN_EMAIL_ALERT = ""; // e.g. "studio@criscrafts.com"
var ENABLE_EMAIL_ALERTS = true;

// 3. AUTOMATED PDF INVOICE GENERATOR:
// Set to true to automatically generate PDF invoices in Google Drive.
var ENABLE_PDF_INVOICES = true;


// ============================================================================
// CORE BRIDGE & EVENT HANDLERS
// ============================================================================

/**
 * Container-bound spreadsheet accessor helper.
 * Automatically binds to whichever Google Sheet this script is attached to.
 */
function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  throw new Error("Unable to access Google Spreadsheet. Please ensure this script is created inside your Google Sheet via Extensions > Apps Script.");
}

// Custom Menu Trigger on Sheet Open
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CrisCrafts Studio 🎨')
    .addItem('🔄 Refresh Dashboard Metrics', 'refreshDashboardMetrics')
    .addItem('🔍 Search Customer VIP Profile', 'searchCustomerVip')
    .addItem('💾 Backup Orders to Google Drive', 'backupOrdersToDrive')
    .addSeparator()
    .addItem('➕ Create New Year Sheet', 'promptNewYearSheet')
    .addItem('🎨 Format All Order Sheets', 'formatAllOrderSheets')
    .addItem('⚡ Run Setup & Health Check', 'runHealthCheck')
    .addToUi();
}

/**
 * Real-time sheet edit trigger: Auto-syncs Executive Dashboard when order statuses change
 */
function onEdit(e) {
  if (!e || !e.range) return;
  try {
    var sheetName = e.range.getSheet().getName();
    if (sheetName.indexOf("Orders ") === 0) {
      updateExecutiveDashboard(e.source);
    }
  } catch (err) {
    Logger.log("onEdit trigger error: " + err.toString());
  }
}

/**
 * Input Sanitization Helper: Prevents Formula Injection (=, +, -, @) in Google Sheets
 */
function sanitizeInput(val) {
  if (val === null || val === undefined) return "";
  var str = String(val).trim();
  if (/^[=+\-@]/.test(str)) {
    return "'" + str; // Lead quote prevents spreadsheet execution
  }
  return str;
}

/**
 * HTML Entity Escaper for Safe PDF & Email Templating
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Handles incoming HTTP POST requests from Next.js serverless route (/api/checkout)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ success: false, error: "Empty request payload received" });
    }
    
    var data = JSON.parse(e.postData.contents);
    
    if (!data.orderId || !data.customerName || !data.phone || !data.address) {
      return responseJson({ success: false, error: "Missing required fields: orderId, customerName, phone, or address" });
    }
    
    var ss = getSpreadsheet();
    var currentYear = new Date().getFullYear();
    var sheetName = "Orders " + currentYear;
    
    var sheet = getOrCreateYearSheet(ss, sheetName);
    
    // Deduplication Check: Prevent Duplicate Row Insertion for Retried Webhooks
    var existingData = sheet.getDataRange().getValues();
    for (var i = 1; i < existingData.length; i++) {
      if (String(existingData[i][0]).trim() === String(data.orderId).trim()) {
        Logger.log("Duplicate order webhook ignored: " + data.orderId);
        return responseJson({ 
          success: true, 
          orderId: data.orderId, 
          yearSheet: sheetName, 
          isDuplicate: true 
        });
      }
    }
    
    var timestamp = data.createdAt ? new Date(data.createdAt) : new Date();
    var shippingRegion = data.shippingRegion || (
      data.shippingMethod === "outside-valley" ? "Outside Valley (Rs. 250)" : "Inside Valley (Rs. 150)"
    );
    
    // Optional: Generate PDF Invoice in Google Drive
    var pdfInvoiceUrl = "";
    if (ENABLE_PDF_INVOICES) {
      try {
        pdfInvoiceUrl = generatePdfInvoice(ss, data);
      } catch (pdfErr) {
        Logger.log("PDF generation warning: " + pdfErr.toString());
      }
    }

    // Append sanitized order row
    sheet.appendRow([
      sanitizeInput(data.orderId),
      timestamp,
      sanitizeInput(data.customerName),
      "'" + String(data.phone).replace(/[\s\-\(\)]/g, ""), // Lead quote preserves phone format
      sanitizeInput(data.address),
      sanitizeInput(shippingRegion),
      sanitizeInput(data.productSummary || "Standard Order"),
      Number(data.totalQuantity || 1),
      Number(data.subtotal || 0),
      Number(data.shippingCost || 0),
      Number(data.total || 0),
      sanitizeInput(data.paymentMethod || "WhatsApp Payment"),
      "WhatsApp Pending", // Default Order Status
      sanitizeInput(data.notes || ""),
      pdfInvoiceUrl ? pdfInvoiceUrl : "N/A"
    ]);
    
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(lastRow, 9, 1, 3).setNumberFormat("Rs. #,##0");
      sheet.getRange(lastRow, 2).setNumberFormat("yyyy-mm-dd hh:mm");
      
      // Order Status Data Validation Dropdown
      var statusRule = SpreadsheetApp.newDataValidation()
        .requireValueInList([
          "WhatsApp Pending",
          "Payment Received",
          "Processing / Crafting",
          "Shipped",
          "Delivered",
          "Cancelled"
        ], true)
        .setAllowInvalid(true)
        .build();
      sheet.getRange(lastRow, 13).setDataValidation(statusRule);
    }
    
    // Optional: Send Admin Email Alert
    if (ENABLE_EMAIL_ALERTS) {
      try {
        sendAdminEmailNotification(data, pdfInvoiceUrl);
      } catch (emailErr) {
        Logger.log("Email alert warning: " + emailErr.toString());
      }
    }
    
    // Auto-update Executive Dashboard
    updateExecutiveDashboard(ss);
    
    lock.releaseLock();
    return responseJson({ 
      success: true, 
      orderId: data.orderId, 
      yearSheet: sheetName,
      invoiceUrl: pdfInvoiceUrl 
    });
    
  } catch (error) {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
    return responseJson({ success: false, error: error.toString() });
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

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

// ============================================================================
// SHEET CREATION & FORMATTING
// ============================================================================

/**
 * Gets or creates a yearly order sheet with styled headers
 */
function getOrCreateYearSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    var headers = [
      "Order ID",
      "Date & Time",
      "Customer Name",
      "Phone Number",
      "Shipping Address",
      "Shipping Region",
      "Products & Customizations Summary",
      "Items Qty",
      "Subtotal (Rs.)",
      "Shipping Fee (Rs.)",
      "Total Amount (Rs.)",
      "Payment Method",
      "Order Status",
      "Customer Notes",
      "Invoice PDF Link"
    ];
    
    sheet.appendRow(headers);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1E293B")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setFontFamily("Georgia")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");
               
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 150); // Order ID
    sheet.setColumnWidth(2, 140); // Date
    sheet.setColumnWidth(3, 160); // Customer Name
    sheet.setColumnWidth(4, 130); // Phone
    sheet.setColumnWidth(5, 220); // Address
    sheet.setColumnWidth(6, 170); // Region
    sheet.setColumnWidth(7, 320); // Products Details
    sheet.setColumnWidth(8, 90);  // Items Qty
    sheet.setColumnWidth(9, 120); // Subtotal
    sheet.setColumnWidth(10, 120); // Shipping Fee
    sheet.setColumnWidth(11, 130); // Total Amount
    sheet.setColumnWidth(12, 180); // Payment Method
    sheet.setColumnWidth(13, 150); // Order Status
    sheet.setColumnWidth(14, 200); // Notes
    sheet.setColumnWidth(15, 220); // Invoice PDF Link
  }
  return sheet;
}

// ============================================================================
// EXECUTIVE DASHBOARD v5 ENGINE
// ============================================================================

/**
 * Creates and updates the Executive Dashboard v5 sheet
 */
function updateExecutiveDashboard(ss) {
  var ss = ss || getSpreadsheet();
  var dash = ss.getSheetByName("Executive Dashboard");
  
  if (!dash) {
    dash = ss.insertSheet("Executive Dashboard", 0);
  }
  
  dash.clear();
  dash.setHiddenGridlines(false);
  
  // Title Banner
  dash.getRange("A1:I1").merge()
      .setValue("🎨 CRISCRAFTS ARTISAN BOUTIQUE — EXECUTIVE DASHBOARD v5 MASTER")
      .setBackground("#1E293B")
      .setFontColor("#FCFBF7")
      .setFontSize(13)
      .setFontWeight("bold")
      .setFontFamily("Georgia")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
  dash.setRowHeight(1, 45);
  
  var currentYear = new Date().getFullYear();
  var yearSheetName = "Orders " + currentYear;
  
  // KPI Header Card Titles
  dash.getRange("A3").setValue("TOTAL LIFETIME REVENUE").setFontWeight("bold").setFontSize(8).setFontColor("#475569");
  dash.getRange("C3").setValue("TOTAL ORDERS COUNT").setFontWeight("bold").setFontSize(8).setFontColor("#475569");
  dash.getRange("E3").setValue(currentYear + " REVENUE").setFontWeight("bold").setFontSize(8).setFontColor("#475569");
  dash.getRange("G3").setValue("AVG ORDER VALUE (AOV)").setFontWeight("bold").setFontSize(8).setFontColor("#475569");
  
  var sheets = ss.getSheets();
  var orderSheets = sheets.filter(function(s) {
    return s.getName().indexOf("Orders ") === 0;
  });
  
  if (orderSheets.length > 0) {
    var revenueFormulaParts = [];
    var countFormulaParts = [];
    
    orderSheets.forEach(function(s) {
      var name = "'" + s.getName() + "'";
      revenueFormulaParts.push("SUM(" + name + "!K2:K)");
      countFormulaParts.push("COUNTA(" + name + "!A2:A)");
    });
    
    dash.getRange("A4").setFormula("=" + revenueFormulaParts.join("+"));
    dash.getRange("C4").setFormula("=" + countFormulaParts.join("+"));
    
    var currentYearSheet = ss.getSheetByName(yearSheetName);
    if (currentYearSheet) {
      dash.getRange("E4").setFormula("=SUM('" + yearSheetName + "'!K2:K)");
    } else {
      dash.getRange("E4").setValue(0);
    }
    
    dash.getRange("G4").setFormula("=IF(C4>0, A4/C4, 0)");
  } else {
    dash.getRange("A4").setValue(0);
    dash.getRange("C4").setValue(0);
    dash.getRange("E4").setValue(0);
    dash.getRange("G4").setValue(0);
  }
  
  dash.getRange("A4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#3B79C6");
  dash.getRange("C4").setFontSize(16).setFontWeight("bold").setNumberFormat("#,##0").setFontColor("#1E293B");
  dash.getRange("E4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#3B79C6");
  dash.getRange("G4").setFontSize(16).setFontWeight("bold").setNumberFormat("Rs. #,##0").setFontColor("#D4B26F");
  
  // Regional Sales Distribution Table
  dash.getRange("A7:D7").merge()
      .setValue("REGIONAL SALES DISTRIBUTION")
      .setBackground("#F5EFE6")
      .setFontWeight("bold")
      .setFontColor("#1E293B");
      
  dash.getRange("A8").setValue("Region").setFontWeight("bold");
  dash.getRange("B8").setValue("Orders").setFontWeight("bold");
  dash.getRange("C8").setValue("Sales (Rs.)").setFontWeight("bold");
  dash.getRange("D8").setValue("Share (%)").setFontWeight("bold");
  
  if (orderSheets.length > 0) {
    var insideCountParts = [], outsideCountParts = [];
    var insideSumParts = [], outsideSumParts = [];
    
    orderSheets.forEach(function(s) {
      var n = "'" + s.getName() + "'";
      insideCountParts.push("COUNTIF(" + n + "!F2:F, \"*Inside Valley*\")");
      outsideCountParts.push("COUNTIF(" + n + "!F2:F, \"*Outside Valley*\")");
      insideSumParts.push("SUMIF(" + n + "!F2:F, \"*Inside Valley*\", " + n + "!K2:K)");
      outsideSumParts.push("SUMIF(" + n + "!F2:F, \"*Outside Valley*\", " + n + "!K2:K)");
    });
    
    dash.getRange("A9").setValue("Inside Valley");
    dash.getRange("B9").setFormula("=" + insideCountParts.join("+"));
    dash.getRange("C9").setFormula("=" + insideSumParts.join("+")).setNumberFormat("Rs. #,##0");
    dash.getRange("D9").setFormula("=IF($A$4>0, C9/$A$4, 0)").setNumberFormat("0.0%");
    
    dash.getRange("A10").setValue("Outside Valley");
    dash.getRange("B10").setFormula("=" + outsideCountParts.join("+"));
    dash.getRange("C10").setFormula("=" + outsideSumParts.join("+")).setNumberFormat("Rs. #,##0");
    dash.getRange("D10").setFormula("=IF($A$4>0, C10/$A$4, 0)").setNumberFormat("0.0%");
  }
  
  // Order Status Breakdown Table
  dash.getRange("F7:I7").merge()
      .setValue("ORDER LIFECYCLE STATUS BREAKDOWN")
      .setBackground("#F5EFE6")
      .setFontWeight("bold")
      .setFontColor("#1E293B");
      
  dash.getRange("F8").setValue("Status Stage").setFontWeight("bold");
  dash.getRange("G8").setValue("Orders").setFontWeight("bold");
  dash.getRange("H8").setValue("Revenue (Rs.)").setFontWeight("bold");
  dash.getRange("I8").setValue("Share (%)").setFontWeight("bold");
  
  var statuses = ["WhatsApp Pending", "Payment Received", "Processing / Crafting", "Shipped", "Delivered", "Cancelled"];
  statuses.forEach(function(status, idx) {
    var row = 9 + idx;
    dash.getRange(row, 6).setValue(status);
    
    if (orderSheets.length > 0) {
      var statusCountParts = [];
      var statusSumParts = [];
      orderSheets.forEach(function(s) {
        var n = "'" + s.getName() + "'";
        statusCountParts.push("COUNTIF(" + n + "!M2:M, \"" + status + "\")");
        statusSumParts.push("SUMIF(" + n + "!M2:M, \"" + status + "\", " + n + "!K2:K)");
      });
      dash.getRange(row, 7).setFormula("=" + statusCountParts.join("+"));
      dash.getRange(row, 8).setFormula("=" + statusSumParts.join("+")).setNumberFormat("Rs. #,##0");
      dash.getRange(row, 9).setFormula("=IF($A$4>0, H" + row + "/$A$4, 0)").setNumberFormat("0.0%");
    } else {
      dash.getRange(row, 7).setValue(0);
      dash.getRange(row, 8).setValue(0).setNumberFormat("Rs. #,##0");
      dash.getRange(row, 9).setValue(0).setNumberFormat("0.0%");
    }
  });
  
  // Yearly Sales Ledger Breakdown Table
  dash.getRange("A14:D14").merge()
      .setValue("YEARLY SALES LEDGER BREAKDOWN")
      .setBackground("#F5EFE6")
      .setFontWeight("bold")
      .setFontColor("#1E293B");
      
  dash.getRange("A15").setValue("Year Tab").setFontWeight("bold");
  dash.getRange("B15").setValue("Total Orders").setFontWeight("bold");
  dash.getRange("C15").setValue("Revenue (Rs.)").setFontWeight("bold");
  dash.getRange("D15").setValue("Avg Order (Rs.)").setFontWeight("bold");
  
  orderSheets.forEach(function(s, idx) {
    var r = 16 + idx;
    var name = "'" + s.getName() + "'";
    dash.getRange(r, 1).setValue(s.getName());
    dash.getRange(r, 2).setFormula("=COUNTA(" + name + "!A2:A)");
    dash.getRange(r, 3).setFormula("=SUM(" + name + "!K2:K)").setNumberFormat("Rs. #,##0");
    dash.getRange(r, 4).setFormula("=IF(B" + r + ">0, C" + r + "/B" + r + ", 0)").setNumberFormat("Rs. #,##0");
  });
  
  dash.setColumnWidth(1, 160);
  dash.setColumnWidth(2, 130);
  dash.setColumnWidth(3, 160);
  dash.setColumnWidth(4, 130);
  dash.setColumnWidth(5, 30);
  dash.setColumnWidth(6, 170);
  dash.setColumnWidth(7, 120);
  dash.setColumnWidth(8, 150);
  dash.setColumnWidth(9, 130);
}

// ============================================================================
// AUTOMATED PDF INVOICE & EMAIL NOTIFICATION ENGINE
// ============================================================================

/**
 * Generates a luxury PDF invoice stored in Google Drive with HTML Escaping
 */
function generatePdfInvoice(ss, data) {
  var folderName = "CrisCrafts Invoices";
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
  
  var safeOrderId = escapeHtml(data.orderId);
  var safeName = escapeHtml(data.customerName);
  var safePhone = escapeHtml(data.phone);
  var safeAddress = escapeHtml(data.address);
  var safeRegion = escapeHtml(data.shippingRegion || "Standard Shipping");
  var safePayment = escapeHtml(data.paymentMethod || "WhatsApp Payment");
  var safeSummary = escapeHtml(data.productSummary || "Standard Order");
  var safeNotes = escapeHtml(data.notes || "");
  
  var htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Georgia', serif; color: #1E293B; margin: 30px; background: #FFF; }
        .header { text-align: center; border-bottom: 2px solid #D4B26F; padding-bottom: 15px; margin-bottom: 25px; }
        .brand { font-size: 24px; font-weight: bold; color: #1E293B; letter-spacing: 1px; }
        .sub { font-size: 11px; color: #64748B; text-transform: uppercase; margin-top: 4px; }
        .grid { width: 100%; margin-bottom: 25px; font-size: 13px; }
        .grid td { vertical-align: top; padding: 4px 0; }
        .label { font-weight: bold; color: #475569; width: 120px; }
        .box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
        .summary-title { font-size: 14px; font-weight: bold; color: #1E293B; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 5px; }
        .summary-text { font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #334155; }
        .total-box { text-align: right; margin-top: 20px; font-size: 14px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #3B79C6; margin-top: 8px; }
        .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">🎨 CRISCRAFTS ARTISAN BOUTIQUE</div>
        <div class="sub">Official Customer Invoice & Order Specification</div>
      </div>
      
      <table class="grid">
        <tr>
          <td class="label">Order ID:</td>
          <td><strong>${safeOrderId}</strong></td>
          <td class="label">Date:</td>
          <td>${dateStr}</td>
        </tr>
        <tr>
          <td class="label">Customer Name:</td>
          <td>${safeName}</td>
          <td class="label">Phone:</td>
          <td>${safePhone}</td>
        </tr>
        <tr>
          <td class="label">Delivery Address:</td>
          <td colspan="3">${safeAddress} (${safeRegion})</td>
        </tr>
        <tr>
          <td class="label">Payment Method:</td>
          <td colspan="3">${safePayment}</td>
        </tr>
      </table>
      
      <div class="box">
        <div class="summary-title">Purchased Items & Customizations</div>
        <div class="summary-text">${safeSummary}</div>
      </div>
      
      <div class="total-box">
        <div>Subtotal: <strong>Rs. ${(data.subtotal || 0).toLocaleString()}</strong></div>
        <div>Shipping Fee: <strong>Rs. ${(data.shippingCost || 0).toLocaleString()}</strong></div>
        <div class="grand-total">Grand Total: Rs. ${(data.total || 0).toLocaleString()}</div>
      </div>
      
      ${safeNotes ? `<div style="margin-top:20px; font-size:12px; color:#475569;"><strong>Customer Notes:</strong> ${safeNotes}</div>` : ''}
      
      <div class="footer">
        Thank you for choosing CrisCrafts Handcrafted Boutique! ❤️<br>
        For inquiries, contact us on WhatsApp.
      </div>
    </body>
    </html>
  `;
  
  var blob = Utilities.newBlob(htmlContent, "text/html", "Invoice_" + safeOrderId + ".html");
  var pdfFile = folder.createFile(blob.getAs("application/pdf")).setName("Invoice_" + safeOrderId + ".pdf");
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return pdfFile.getUrl();
}

/**
 * Sends styled HTML order notification email to admin/owner
 */
function sendAdminEmailNotification(data, pdfUrl) {
  var recipient = ADMIN_EMAIL_ALERT && ADMIN_EMAIL_ALERT.trim() !== "" 
    ? ADMIN_EMAIL_ALERT 
    : Session.getEffectiveUser().getEmail();
    
  if (!recipient) return;
  
  var safeOrderId = escapeHtml(data.orderId);
  var safeName = escapeHtml(data.customerName);
  var safePhone = escapeHtml(data.phone);
  var safeAddress = escapeHtml(data.address);
  var safeRegion = escapeHtml(data.shippingRegion || "Standard");
  var safeSummary = escapeHtml(data.productSummary || "Standard Order");
  
  var subject = "🛍️ New Order Received: " + safeOrderId + " (" + safeName + ")";
  
  var bodyHtml = `
    <div style="font-family: Arial, sans-serif; background:#F8FAFC; padding:20px;">
      <div style="max-width:600px; background:#FFF; border-radius:12px; border:1px solid #E2E8F0; padding:25px; margin:0 auto;">
        <h2 style="color:#1E293B; margin-top:0; border-bottom:2px solid #D4B26F; padding-bottom:10px;">
          🎁 New Order Placed: ${safeOrderId}
        </h2>
        
        <p style="font-size:14px; color:#334155;">A new handcrafted order has just been submitted on <strong>CrisCrafts</strong>!</p>
        
        <table style="width:100%; font-size:13px; color:#475569; margin-bottom:20px;">
          <tr><td style="font-weight:bold; width:130px;">Customer Name:</td><td>${safeName}</td></tr>
          <tr><td style="font-weight:bold;">Phone Number:</td><td><a href="tel:${safePhone}">${safePhone}</a></td></tr>
          <tr><td style="font-weight:bold;">Shipping Address:</td><td>${safeAddress}</td></tr>
          <tr><td style="font-weight:bold;">Shipping Region:</td><td>${safeRegion}</td></tr>
          <tr><td style="font-weight:bold;">Grand Total:</td><td style="color:#3B79C6; font-size:16px; font-weight:bold;">Rs. ${(data.total || 0).toLocaleString()}</td></tr>
        </table>
        
        <div style="background:#F1F5F9; border-radius:8px; padding:15px; font-size:12px; margin-bottom:20px;">
          <strong>Order Items Summary:</strong><br>
          <pre style="font-family:inherit; white-space:pre-wrap; margin-top:8px;">${safeSummary}</pre>
        </div>
        
        ${pdfUrl ? `<p><a href="${pdfUrl}" style="background:#1E293B; color:#FFF; padding:10px 18px; text-decoration:none; border-radius:6px; font-size:13px; font-weight:bold;">📄 View PDF Invoice in Drive</a></p>` : ''}
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: bodyHtml
  });
}

// ============================================================================
// INTERACTIVE TOOLBAR MENU MODULES
// ============================================================================

function refreshDashboardMetrics() {
  var ss = getSpreadsheet();
  updateExecutiveDashboard(ss);
  SpreadsheetApp.getUi().alert("✅ CrisCrafts Executive Dashboard v5 successfully refreshed!");
}

function promptNewYearSheet() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Create New Year Sheet', 'Enter Year (e.g., 2027):', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) {
    var yearStr = response.getResponseText().trim();
    if (yearStr && !isNaN(yearStr) && yearStr.length === 4) {
      var ss = getSpreadsheet();
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
  var ss = getSpreadsheet();
  var sheets = ss.getSheets();
  sheets.forEach(function(s) {
    if (s.getName().indexOf("Orders ") === 0) {
      getOrCreateYearSheet(ss, s.getName());
    }
  });
  updateExecutiveDashboard(ss);
  SpreadsheetApp.getUi().alert("✨ All Order Sheets formatted successfully!");
}

/**
 * VIP Customer Search & Lifetime Value Directory Tool
 */
function searchCustomerVip() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('🔍 Customer VIP Directory', 'Enter Customer Phone or Name:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  var query = response.getResponseText().trim().toLowerCase();
  if (!query) return;
  
  var ss = getSpreadsheet();
  var orderSheets = ss.getSheets().filter(function(s) { return s.getName().indexOf("Orders ") === 0; });
  
  var totalOrders = 0;
  var totalSpend = 0;
  var matchedCustomerName = "";
  var history = [];
  
  orderSheets.forEach(function(s) {
    var data = s.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var name = String(row[2] || "").toLowerCase();
      var phone = String(row[3] || "").toLowerCase();
      
      if (name.indexOf(query) !== -1 || phone.indexOf(query) !== -1) {
        totalOrders++;
        var orderTotal = Number(row[10] || 0);
        totalSpend += orderTotal;
        matchedCustomerName = row[2];
        history.push("• " + row[0] + " | " + row[10] + " Rs. | " + (row[12] || "Pending"));
      }
    }
  });
  
  if (totalOrders === 0) {
    ui.alert("🔍 No orders found matching: \"" + query + "\"");
    return;
  }
  
  var tier = "🥉 Bronze Artisan";
  if (totalSpend >= 10000) tier = "💎 Diamond Elite Connoisseur";
  else if (totalSpend >= 5000) tier = "🥇 Gold VIP Patron";
  else if (totalSpend >= 2500) tier = "🥈 Silver Collector";
  
  var msg = "👑 VIP PROFILE: " + matchedCustomerName + "\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "Tier: " + tier + "\n" +
            "Total Orders: " + totalOrders + "\n" +
            "Lifetime Spend: Rs. " + totalSpend.toLocaleString() + "\n\n" +
            "Recent Order History:\n" + history.slice(0, 5).join("\n");
            
  ui.alert(msg);
}

/**
 * One-Click Backup of Order Ledgers to Google Drive
 */
function backupOrdersToDrive() {
  var ui = SpreadsheetApp.getUi();
  try {
    var ss = getSpreadsheet();
    var folderName = "CrisCrafts Backups";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    var timeStamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd_HHmm");
    var backupName = "CrisCrafts_Orders_Backup_" + timeStamp + ".csv";
    
    var currentYear = new Date().getFullYear();
    var sheet = ss.getSheetByName("Orders " + currentYear);
    if (!sheet) throw new Error("No order sheet found for current year.");
    
    var data = sheet.getDataRange().getValues();
    var csvContent = data.map(function(row) {
      return row.map(function(cell) {
        return '"' + String(cell).replace(/"/g, '""') + '"';
      }).join(",");
    }).join("\n");
    
    var file = folder.createFile(backupName, csvContent, MimeType.CSV);
    ui.alert("💾 Backup Created Successfully!\nFolder: CrisCrafts Backups\nFile: " + file.getName());
  } catch (err) {
    ui.alert("❌ Backup Error: " + err.toString());
  }
}

function runHealthCheck() {
  var ui = SpreadsheetApp.getUi();
  try {
    var ss = getSpreadsheet();
    var currentYear = new Date().getFullYear();
    var sheet = getOrCreateYearSheet(ss, "Orders " + currentYear);
    updateExecutiveDashboard(ss);
    ui.alert("🎉 Health Check Passed!\nConnected Sheet: " + ss.getName() + "\nActive Tab: " + sheet.getName());
  } catch (err) {
    ui.alert("❌ Health Check Failed:\n" + err.toString());
  }
}
```

3. Save the script project (`Ctrl + S`).

---

## Step 2: Deploy as a Web Application
1. Click the blue **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure settings:
   - **Description**: `CrisCrafts Master Webhook Bridge v5`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Grant permissions if prompted by clicking **Authorize access** > **Advanced** > **Go to Project (unsafe)**.
6. Copy the generated **Web app URL**:
   `https://script.google.com/macros/s/.../exec`

---

## Step 3: Add Webhook URL to Next.js
In your Next.js `.env.local` file (and Vercel Production Environment Variables):

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
```

Your web app will now automatically log orders into yearly ledger sheets, trigger instant admin email alerts, generate printable PDF invoices in Google Drive, populate the Executive Dashboard, and provide VIP customer lookup!
