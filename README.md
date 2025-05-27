[![Watch on YouTube](https://img.youtube.com/vi/Evn8p3Q1Xi0/0.jpg)](https://www.youtube.com/watch)

## Inspiration

I was inspired by the need for a truly flexible, AI-powered dashboard builder that empowers anyone to visualize and interact with live data—without writing code. I wanted to break the limitations of static dashboards and enable users to generate and customize layouts and content simply by describing what they want. The capabilities of Perplexity’s Sonar API opened up new possibilities for real-time, prompt-driven dashboard creation.

---

## What it does

DashboardsAI lets users:

- Instantly create dashboards filled with interactive, AI-generated cards (iframes)
- Add cards for news, charts, weather, stocks, todo lists, and more—just by entering a prompt
- Interact directly with cards (for example, mark todos done or use live charts)
- Zoom in and out for perfect visibility
- Rearrange, resize, and organize cards in edit mode
- Set interval prompts for cards to auto-refresh with the latest data
- Preview cards in a resizable modal before saving
- Copy cards between dashboards for easy sharing and reuse
- Explore and add popular public cards from the Explore section
- (Coming soon) Host dashboards on custom domains, integrate with services like Google Calendar and Slack, and manage advanced settings

---

## How I built it

- **Frontend:** Built with React and modern UI libraries, featuring a sleek, dark-themed interface and robust state management for smooth editing, previewing, and dashboard organization.
- **Backend:** Integrates with Perplexity’s Sonar API to generate HTML for each card based on user prompts and interval settings.
- **Key Features:**
    - Card management (create, edit, delete, copy, move)
    - Real-time iframe rendering
    - Interval-based auto-refresh
    - Interactive previews and modals
    - Explore section for public cards
    - Planned integrations and hosting

---

## Challenges I ran into

- Ensuring dynamic, user-generated HTML renders safely and responsively within iframes, while maintaining full interactivity and security
- Implementing efficient, reliable interval prompts and auto-refresh without overloading the API or UI
- Designing an intuitive workflow for both beginners and advanced users, especially around editing, previewing, and managing multiple dashboards
- Preventing XSS and other vulnerabilities when handling user prompts and HTML content

---

## Accomplishments that I'm proud of

- Built a fully functional, AI-powered dashboard builder with live, interactive cards
- Enabled non-technical users to create and customize dashboards using natural language
- Developed a flexible, modern UI supporting drag-and-drop, resizing, and zooming
- Implemented interval-based auto-refresh for real-time data
- Made it easy to copy, share, and reuse cards across dashboards

---

## What I learned

- The power and flexibility of Perplexity’s Sonar API for generating dynamic, interactive content
- Best practices for secure HTML rendering and user input handling
- How to balance advanced features with a simple, intuitive user experience
- The importance of real-time feedback and previews for user confidence

---

## What's next for DashboardsAI

- Launching custom domain hosting so users can share dashboards publicly
- Adding integrations with Google Calendar, Slack, and other popular tools
- Expanding the Explore section with more public cards and templates
- Advanced analytics and usage statistics for users
- More card types and interactive widgets
- Continuous improvements based on user feedback



## Development

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
