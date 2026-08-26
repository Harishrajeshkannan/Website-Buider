# Requirements Document

## Introduction

This document specifies the requirements for a premium portfolio website that showcases websites built by the site owner for various business clients. The site is positioned as a high-end digital studio showcase rather than a generic developer portfolio. It emphasizes editorial visual design, large project previews, strong typography, whitespace, subtle motion, and micro-interactions.

Content is stored in and served from a Supabase Postgres database rather than static data files, and uploaded images are stored in Supabase Storage. A typed schema still governs the shape of Project and related content, but the data itself is persisted in the database. Projects, testimonials, website types, and site content are managed through an admin dashboard protected by Supabase Auth, so new content can be added without modifying code. The site itself serves as a demonstration of the owner's web design and development quality and must render responsively across desktop, tablet, and mobile.

The recommended technical direction is Next.js (App Router) with TypeScript, Tailwind CSS, Framer Motion, and `next/image`, backed by Supabase (Postgres, Storage, Auth) and deployed on Vercel. Personal details (owner name, tagline, contact email) and real project entries may use placeholder values until confirmed.

## Glossary

- **Portfolio_Site**: The complete premium portfolio website being specified.
- **Visitor**: Any person browsing the Portfolio_Site, typically a prospective client.
- **Owner**: The person who built the showcased websites and owns the Portfolio_Site.
- **Admin_User**: The authenticated Owner who manages content through the Admin_Dashboard.
- **Admin_Dashboard**: The authenticated interface for managing content and viewing inquiries.
- **Database**: The persistent store holding Project, Testimonial, website type, site content, and Inquiry records.
- **Image_Storage**: The storage bucket holding uploaded images and serving their public URLs.
- **Project**: A single showcased website built for a business client, including its metadata, preview media, and links.
- **Project_Schema**: The typed data structure that defines the shape of a Project entry.
- **Inquiry**: A persisted contact-form submission, retaining name, email, message, and timestamp.
- **Hero_Section**: The introductory section presenting the Owner and value proposition.
- **Selected_Work_Section**: The section displaying large, visually dominant Project previews.
- **Project_Detail_Page**: An individual case-study page for a single Project.
- **Portfolio_Filter**: The control that filters displayed Projects by industry or category.
- **Website_Types_Section**: The section describing the categories of websites the Owner builds.
- **Process_Section**: The section presenting the Owner's workflow stages: Strategy, Design, Development, Launch.
- **Testimonial**: A client quote associated with a specific Project.
- **About_Section**: The section describing the Owner.
- **Contact_Section**: The section containing the primary call to action and contact form.
- **Contact_Form**: The form allowing a Visitor to submit an inquiry.
- **Live_Site_Link**: The external URL to a Project's live website.
- **Breakpoint**: A defined viewport width range for desktop, tablet, or mobile layouts.

## Requirements

### Requirement 1: Data-Driven Project Schema

**User Story:** As the Owner, I want all project content defined by a typed schema and persisted in the Database, so that I can add new projects through the Admin_Dashboard without changing components.

#### Acceptance Criteria

1. THE Project_Schema SHALL define, for each Project, the following required typed fields: unique identifier (string, 1 to 60 characters, unique across all entries), business/client name (string, 1 to 100 characters), industry/category (string, 1 to 60 characters), short description (string, 1 to 200 characters), preview image reference (non-empty string), and Live_Site_Link (non-empty string conforming to a valid URL format).
2. THE Project_Schema SHALL define the following optional typed fields for each Project: long description (string, 1 to 2000 characters), associated Testimonial (object containing quote text, author name, and role), and detail-page content sections (array of content blocks).
3. THE Portfolio_Site SHALL source all displayed Project content from the Database; zero Project content values shall be hardcoded in UI component source files.
4. WHEN a new Project that conforms to the Project_Schema is added through the Admin_Dashboard, THE Portfolio_Site SHALL display the new Project in the Selected_Work_Section without modification to any UI component source files.
5. IF a Project record omits a required Project_Schema field or provides a value whose type does not match the declared type, THEN THE system SHALL reject the record at the Database or application layer and report an error identifying the offending field.
6. IF two or more Project records declare the same unique identifier, THEN THE system SHALL reject the duplicate at the Database or application layer and report an error identifying the duplicate identifier.
7. IF a Project's Live_Site_Link does not conform to a valid URL format, THEN THE system SHALL reject the record at the Database or application layer and report a validation error.
8. WHERE a Project record omits an optional field, THE Portfolio_Site SHALL render that Project without the corresponding UI element and without a runtime error.

### Requirement 2: Content Persistence and Retrieval

**User Story:** As the Owner, I want all site content stored in the Database, so that content is managed centrally and served dynamically.

#### Acceptance Criteria

1. THE system SHALL store Projects, Testimonials, website types, and site content in the Database.
2. WHEN a Visitor loads a page, THE Portfolio_Site SHALL retrieve all displayed content for that page from the Database and render it within 3 seconds under normal operating conditions.
3. IF the Database does not return a response within 10 seconds when loading content, THEN THE Portfolio_Site SHALL treat the Database as unreachable, display a user-visible error message indicating content could not be loaded, and continue running without terminating the process or displaying an unhandled exception.
4. IF the Database is reachable but returns no records for a requested content type, THEN THE Portfolio_Site SHALL display an empty-content state for that section without displaying an error and without terminating.

### Requirement 3: Image Upload and Storage

**User Story:** As the Admin_User, I want to upload project preview images, so that projects display imagery without manual file handling.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL allow the Admin_User to upload a project preview image to Image_Storage.
2. WHEN an image upload completes successfully, THE system SHALL store the resulting public URL reference on the associated Project record.
3. THE system SHALL accept uploads only of image files in JPEG, PNG, or WebP format and SHALL enforce a maximum file size of 5 megabytes.
4. IF an upload is not in an accepted image format (JPEG, PNG, or WebP) or exceeds 5 megabytes, THEN THE Admin_Dashboard SHALL reject the upload and display a validation error indicating the accepted formats and maximum size, and SHALL NOT store the file.
5. IF an upload fails for any reason other than validation, THEN THE Admin_Dashboard SHALL display an error indicating the upload did not complete and SHALL leave the Project record unchanged, with no URL reference created or updated.

### Requirement 4: Admin Authentication

**User Story:** As the Owner, I want the Admin_Dashboard protected by authentication, so that only I can manage content and view inquiries.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL be accessible only to an authenticated Admin_User.
2. WHEN an unauthenticated Visitor requests an Admin_Dashboard route, THE Portfolio_Site SHALL redirect the Visitor to a sign-in page without exposing Admin_Dashboard content.
3. WHEN an Admin_User signs in with valid credentials, THE Portfolio_Site SHALL grant access to the Admin_Dashboard and establish a session.
4. IF sign-in credentials are invalid, THEN THE Portfolio_Site SHALL deny access and display an authentication error indicating the credentials were not accepted.
5. IF 5 consecutive sign-in attempts with invalid credentials occur for the same account, THEN THE Portfolio_Site SHALL temporarily block further sign-in attempts for that account for 15 minutes and display a message indicating the account is temporarily locked.
6. WHEN an Admin_User signs out, or WHEN a session remains inactive for 30 minutes, THE Portfolio_Site SHALL end the session and revoke access to Admin_Dashboard routes.

### Requirement 5: Admin Content Management

**User Story:** As the Admin_User, I want to manage all site content from the Admin_Dashboard, so that I can keep the portfolio current without editing code.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL allow the Admin_User to create, edit, and delete Project entries.
2. THE Admin_Dashboard SHALL allow the Admin_User to manage Testimonials, website types, and site content (owner name, tagline, service statement, about text).
3. WHEN the Admin_User saves a valid content change, THE system SHALL persist the change to the Database.
4. WHEN a content change is persisted to the Database, THE Portfolio_Site SHALL reflect the persisted change on the public site within 5 seconds of the successful save.
5. WHEN a content change is persisted to the Database, THE Admin_Dashboard SHALL display a success confirmation indicating the change was saved.
6. IF the Admin_User submits invalid content (missing required field, a Live_Site_Link that does not conform to a valid URL format, or a duplicate unique identifier), THEN THE Admin_Dashboard SHALL reject the save, retain the Admin_User's entered values, and display a validation message identifying each offending field.
7. WHEN the Admin_User initiates deletion of a Project entry, THE Admin_Dashboard SHALL require an explicit confirmation before removing the entry from the Database.

### Requirement 6: Inquiry Management

**User Story:** As the Admin_User, I want to view submitted inquiries, so that I can follow up with prospective clients.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display the list of persisted Inquiry records with name, email, message, and timestamp, ordered from most recent timestamp first to oldest timestamp last.
2. WHEN the Admin_User selects an Inquiry, THE Admin_Dashboard SHALL display that individual Inquiry's name, email, message, and timestamp.
3. IF no Inquiry record exists in the Database, THEN THE Admin_Dashboard SHALL display an empty-state message indicating that no inquiries have been received and SHALL render without a runtime error.
4. IF the Database is unreachable when loading Inquiry records, THEN THE Admin_Dashboard SHALL display an error state indicating inquiries could not be loaded and SHALL continue running without crashing.

### Requirement 7: Hero Section

**User Story:** As a Visitor, I want a clear, minimal introduction, so that I immediately understand who the Owner is and what the Owner does.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the Owner name (1 to 100 characters), a tagline (1 to 160 characters), and a statement of the Owner's service offering (1 to 300 characters).
2. WHEN a Visitor activates the primary call-to-action control, THE Hero_Section SHALL navigate the Visitor to the Contact_Section.
3. THE Hero_Section SHALL source the Owner name, tagline, and service statement from the Database.
4. IF the Owner name, tagline, or service statement is missing or empty in the Database, THEN THE Hero_Section SHALL render the corresponding configured placeholder value in place of the missing field.
5. WHERE placeholder values are configured for the Owner name, tagline, or contact details, THE Hero_Section SHALL render the placeholder values.

### Requirement 8: Selected Work Section

**User Story:** As a Visitor, I want to see large, visually dominant previews of the Owner's work, so that the quality of the websites is the main focus.

#### Acceptance Criteria

1. THE Selected_Work_Section SHALL display each Project with the business/client name (1 to 100 characters), industry (1 to 60 characters), short description (1 to 200 characters), preview image, and a Live_Site_Link.
2. THE Selected_Work_Section SHALL render each Project preview image occupying a larger rendered area than any other element within the same Project entry.
3. WHEN a Visitor activates a Project's Live_Site_Link, THE Portfolio_Site SHALL open the corresponding live website in a new browser tab.
4. WHEN a Visitor selects a Project entry, THE Portfolio_Site SHALL navigate to the corresponding Project_Detail_Page.
5. WHEN a Visitor positions the pointer over a Project preview, THE Selected_Work_Section SHALL apply a hover transition effect to that preview that completes within 150 to 400 milliseconds.
6. THE Selected_Work_Section SHALL render Project preview images using an optimized image component that serves responsive image sizes.
7. IF no Project is available in the Database, THEN THE Selected_Work_Section SHALL display an empty-state message indicating that no work is currently available.
8. IF a Project preview image fails to load, THEN THE Selected_Work_Section SHALL display a fallback placeholder image in its place while retaining the remaining Project details.

### Requirement 9: Project Detail / Case-Study Pages

**User Story:** As a Visitor, I want a dedicated case-study page for each project, so that I can understand the project in depth.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL generate one Project_Detail_Page for each Project in the Database.
2. THE Project_Detail_Page SHALL display the business/client name, industry, long description (when available) or short description, preview image, and Live_Site_Link for the corresponding Project.
3. WHERE a Project has an associated Testimonial, THE Project_Detail_Page SHALL display the Testimonial quote text and author name.
4. WHEN a Visitor requests a Project_Detail_Page for an identifier that does not exist in the Database, THE Portfolio_Site SHALL return a 404 not-found page.
5. THE Project_Detail_Page SHALL provide a navigation control that returns the Visitor to the Selected_Work_Section.

### Requirement 10: Portfolio Filtering

**User Story:** As a Visitor, I want to filter projects by industry or category, so that I can find relevant examples of work.

#### Acceptance Criteria

1. THE Portfolio_Filter SHALL present the set of unique industries or categories derived from the Project entries in the Database plus an "All" option.
2. WHEN the Portfolio_Filter loads initially, THE Portfolio_Filter SHALL have the "All" option selected by default.
3. WHEN a Visitor selects an industry or category in the Portfolio_Filter, THE Selected_Work_Section SHALL display only the Projects whose industry or category matches the selection.
4. WHEN a Visitor selects the "All" option, THE Selected_Work_Section SHALL display every Project in the Database.
5. THE Portfolio_Filter SHALL support only single-category selection at a time; selecting a new category SHALL deselect the previous category.

### Requirement 11: Website Types Section

**User Story:** As a Visitor, I want to see the types of websites the Owner builds, so that I understand the range of services offered.

#### Acceptance Criteria

1. THE Website_Types_Section SHALL display each website type entry with a non-empty name and a non-empty description.
2. THE Website_Types_Section SHALL source all website type entries from the Database.
3. WHERE the Database contains no website type entries, THE Website_Types_Section SHALL render without any website type entry and without a runtime error.

### Requirement 12: Process Section

**User Story:** As a Visitor, I want to see the Owner's working process, so that I understand how the Owner delivers projects.

#### Acceptance Criteria

1. THE Process_Section SHALL display exactly four process stages in the order Strategy, Design, Development, Launch.
2. THE Process_Section SHALL display a non-empty description for each of the four process stages.
3. THE Process_Section SHALL source the description for each process stage from the Database.

### Requirement 13: Testimonials

**User Story:** As a Visitor, I want to read testimonials tied to specific projects, so that I can trust the quality of the Owner's work.

#### Acceptance Criteria

1. THE Testimonial SHALL include non-empty quote text, a non-empty author name, and a reference to an existing Project in the Database.
2. WHERE a Project has an associated Testimonial, THE Portfolio_Site SHALL display the Testimonial together with the business/client name of the associated Project.
3. WHERE a Project has no associated Testimonial, THE Portfolio_Site SHALL omit any Testimonial for that Project without a runtime error.
4. THE Portfolio_Site SHALL source all Testimonial content from the Database.

### Requirement 14: About Section

**User Story:** As a Visitor, I want to learn about the Owner, so that I can decide whether to engage the Owner's services.

#### Acceptance Criteria

1. THE About_Section SHALL display the biographical text describing the Owner sourced from the Database.
2. WHERE the Database provides non-placeholder biographical text, THE About_Section SHALL render that biographical text.
3. WHERE the Database provides only placeholder biographical text, THE About_Section SHALL render the placeholder text.

### Requirement 15: Contact Section and Call to Action

**User Story:** As a Visitor, I want a clear way to contact the Owner, so that I can start a project inquiry.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a final call-to-action statement inviting the Visitor to contact the Owner.
2. THE Contact_Section SHALL display the Contact_Form with a name field accepting 1 to 100 characters, an email address field accepting 1 to 254 characters, and a message field accepting 1 to 2000 characters.
3. WHEN a Visitor submits the Contact_Form with all required fields completed within their allowed length limits, THE Portfolio_Site SHALL persist the submission as an Inquiry record in the Database, retaining the name, email, message, and a timestamp.
4. WHEN an Inquiry is successfully persisted, THE Portfolio_Site SHALL display a submission-confirmation message within 5 seconds of the successful save.
5. IF a Visitor submits the Contact_Form with one or more empty required fields, THEN THE Contact_Form SHALL display a validation message identifying each incomplete field and SHALL retain the Visitor's entered values.
6. IF a Visitor submits the Contact_Form with an email address that does not match the format local-part@domain (containing exactly one @ symbol, at least one character before it, and at least one dot-separated domain after it), THEN THE Contact_Form SHALL display a validation message indicating the email format is invalid and SHALL retain the Visitor's entered values.
7. IF persisting the Inquiry fails, THEN THE Contact_Form SHALL display an error message indicating the inquiry could not be saved and SHALL retain the Visitor's entered values.

### Requirement 16: Responsive Layout

**User Story:** As a Visitor, I want the site to adapt to my device, so that I have a good experience on desktop, tablet, and mobile.

#### Acceptance Criteria

1. WHILE a Visitor views the Portfolio_Site at a viewport width of 1024 pixels or greater (desktop Breakpoint), THE Portfolio_Site SHALL render the desktop layout.
2. WHILE a Visitor views the Portfolio_Site at a viewport width from 768 pixels to 1023 pixels (tablet Breakpoint), THE Portfolio_Site SHALL render the tablet layout.
3. WHILE a Visitor views the Portfolio_Site at a viewport width of 767 pixels or less (mobile Breakpoint), THE Portfolio_Site SHALL render the mobile layout.
4. THE Portfolio_Site SHALL display all content sections without horizontal overflow at viewport widths of 320 pixels and above, across desktop, tablet, and mobile Breakpoints.

### Requirement 17: Motion and Micro-Interactions

**User Story:** As a Visitor, I want subtle, high-quality animations, so that the site feels premium and polished.

#### Acceptance Criteria

1. WHEN at least 25 percent of a content section's area enters the viewport during scrolling, THE Portfolio_Site SHALL apply an entrance transition to that section.
2. WHEN a Visitor interacts with an interactive control, THE Portfolio_Site SHALL apply a micro-interaction transition to that control and SHALL complete that micro-interaction transition within 300 milliseconds of the transition start.
3. WHILE a Visitor has enabled a reduced-motion preference in the browser or operating system, THE Portfolio_Site SHALL disable all entrance and micro-interaction transitions and SHALL display the affected content and controls in their final rendered state without transition.
4. THE Portfolio_Site SHALL complete each entrance transition within 600 milliseconds of the transition start.

### Requirement 18: Accessibility

**User Story:** As a Visitor using assistive technology, I want the site to be accessible, so that I can navigate and understand the content.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL provide a non-empty alternative text attribute for each Project preview image sourced from the Database.
2. THE Portfolio_Site SHALL make every interactive control reachable and operable using only the keyboard, including the Portfolio_Filter, Live_Site_Link controls, and Contact_Form fields.
3. WHEN an interactive control receives keyboard focus, THE Portfolio_Site SHALL render a visible focus indicator on that control that is distinguishable from its unfocused state.
4. WHEN a Visitor navigates the Portfolio_Site using the keyboard Tab key, THE Portfolio_Site SHALL move focus between interactive controls in the order in which the controls appear in the content.
