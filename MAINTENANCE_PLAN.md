# Pura Vida Mae - Web Development & Maintenance Plan

## Initial Setup & Development Fee
**Cost:** $2,500
**Includes:**
- Full-stack PWA development (React, Vite, Tailwind CSS)
- Firebase backend integration (Authentication, Firestore Database)
- Stripe payment processing integration
- Host Dashboard for vehicle management
- Responsive, mobile-first design
- Initial deployment and configuration

## Ongoing Maintenance & Support
**Cost:** $200 / month (1-year contract)

### What is Included in the Monthly Maintenance:
As the web developer, your responsibilities under this $200/month retainer include:

1. **Security & Dependency Updates**
   - Regular updates to React, Vite, Tailwind, and other npm packages.
   - Firebase SDK updates and security rule audits.
   - Stripe API version monitoring and updates.

2. **Uptime Monitoring & Bug Fixes**
   - Monitoring the application for downtime or critical errors.
   - Fixing any bugs or glitches that arise in the existing codebase.
   - Ensuring the PWA manifest and service workers remain functional across new browser updates.

3. **Database & Asset Management**
   - Monitoring Firebase Firestore usage to ensure it stays within optimal pricing tiers.
   - Routine database backups (if configured) and index optimization.
   - Managing image assets and ensuring fast load times.

4. **Minor Content Updates**
   - Small text changes, updating terms of service, or adjusting pricing models in the code.
   - Adding or removing static content pages (e.g., FAQ, About Us).

5. **Technical Support for the Host**
   - Assisting the business owner with using the Host Dashboard.
   - Troubleshooting issues with Stripe payouts or Firebase authentication.

### What is NOT Included (Billable at $50/hour):
Any work that falls outside routine maintenance will be billed at your hourly rate of $50/hr. This includes:

- **New Feature Development:** Adding AI damage detection, dynamic pricing algorithms, or an AI support chatbot (Phase 4).
- **Major Design Overhauls:** Redesigning the UI/UX or adding entirely new user flows.
- **Custom Integrations:** Integrating third-party APIs not included in the initial scope (e.g., advanced telematics, custom CRM).
- **Extensive Data Entry:** Manually uploading large fleets of vehicles (the host should use the dashboard for this).

## Future Feature Roadmap & Estimates (Phase 4)

If the business owner wishes to expand the platform, here are estimated costs based on your $50/hr rate:

| Feature | Estimated Hours | Estimated Cost | Description |
| :--- | :--- | :--- | :--- |
| **AI Damage Detection** | 15 - 20 hrs | $750 - $1,000 | Integrate Google Gemini Vision API to analyze pre/post trip photos for new damage. |
| **Dynamic Pricing Engine** | 10 - 15 hrs | $500 - $750 | Implement an algorithm to adjust prices based on demand, season, and local events. |
| **AI Support Agent** | 10 - 12 hrs | $500 - $600 | Integrate a Gemini-powered chatbot to answer common guest questions 24/7. |
| **Advanced Telematics** | 20 - 30 hrs | $1,000 - $1,500 | Integrate with hardware APIs (e.g., Smartcar) for remote unlocking and mileage tracking. |

## Host Onboarding Checklist
Steps the future host must take to operate their dashboard:

1. **Stripe Account Setup:** Create a Stripe account and provide the API keys to the developer for integration.
2. **Firebase Account Setup:** Take ownership of the Firebase project (or have the developer transfer it) to manage billing and view raw data.
3. **Vehicle Upload:** Use the "Host Listings" tab in the dashboard to upload their fleet, including high-quality images, pricing, and descriptions.
4. **Terms of Service:** Provide their specific rental agreement terms to be updated in the application.
