# Release Notes - v1.1.0

## What's New
* **Factor Analysis**: The IOI-HA score is now intelligently split into its two core diagnostic factors ("Technology/Fitting" and "Lifestyle/Counseling") on both the individual patient rows and the aggregate population stats cards.
* **Questionnaire Mailing Tracker**: Added a convenient toggle to the patient roster to mark when a one-month follow-up questionnaire has been sent out, including a badge to highlight when a shipment is due.
* **Change Password**: You can now securely change the master application encryption password from the login screen (using the master reset flow) or while unlocked.
* **Improved UI Contrast**: Removed the low-contrast pastel green highlights inside the charts and user interface in favor of a deeper, highly-readable Teal theme to ensure text strictly meets WCAG contrast standards.

---

# Release Notes - v1.0.0

🎉 Welcome to the initial release of the **PDSA Outcome Tracker**!

This application is designed specifically for audiology clinics to track patient outcomes and continuously improve care quality using Plan-Do-Study-Act (PDSA) methodology, built around the internationally recognized IOI-HA benchmark.

## Features Included in Initial Release

### Core Tracking
* **Patient Roster**: Maintain a list of patients organized by Fit Date, User Type (New vs. Experienced), and Hearing Aid Model.
* **IOI-HA Assessments**: Administer the standard 8-question International Outcome Inventory for Hearing Aids.
* **Instant Scoring**: Automatically calculates the average IOI-HA score (Questions 1-7) upon assessment completion.

### Advanced Analytics Dashboard
* **Population Overview**: View top-level summary statistics including Mean, Median, and Count segmented by all patients, new users, and experienced users.
* **Cumulative Average (Run Chart)**: Track the running average of IOI-HA scores as new patient data is aggregated chronologically—an essential tool for true PDSA cycle tracking.
* **Item Averages vs Norms**: Drill down into the 7 specific IOI-HA categories. Compare your clinic's average on each item directly against the normative targets established by Cox, Alexander, & Beyer (2002).
* **Dynamic Benchmarking**: The normative chart dynamically adjusts its green target band based on the selected patient filter (Mild-Moderate vs Moderately-Severe), ensuring you are comparing 'apples to apples'.

### Security & Privacy
* **Fully Offline**: Your data never leaves your computer. The application functions entirely locally.
* **Local Persistence**: Data is safely saved to your computer's storage so it remains available across sessions.
* **AES-256 Encryption**: The patient database is scrambled with military-grade AES-256 encryption at rest. You control the master password, ensuring sensitive PHI remains secure.

### Cross-Platform Desktop Support
* **Tauri Integration**: Built as a native desktop application using Rust.
* **Available Installers**:
  * Windows (`.exe` / `.msi`)
  * macOS (`.dmg`)
  * Linux (`.deb` / `.AppImage`)
