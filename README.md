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


----

# Wasmer Frontend Task

Objective: You’ll need to build the pages indicated in the Figma design.

## How the task will be evaluated

This are the things we take into account to evaluate your solution:

1. Pixel perfection: the layout should be matching very closely the Figma designs (we look very closely at this: from paddings / margins / colors / font-sizes and more.
2. Code structure: we look for code that is clean, simple, easy to maintain.
3. Data fetching via reusable components (reuse data with fragments, for components that are reusable and require data from GraphQL). More info on GraphQL fragments in React-relay: https://relay.dev/docs/tutorial/fragments-1/
4. Collaboration / communication: if you encounter any blockers, or if you have questions we expect you to communicate as we are all one team.

# 👨‍💻 Lets get started!

We provided a repo ready to start building. Please use the provided repo as the starting point of your task. You can find the repo here:

https://github.com/wasmerio/frontend-task

Note: you may be invited to https://github.com/syrusakbary/frontend-task in case we don’t have organization seats available.

## ⚙️ Tech stack.

The tech stack that we use is:

- TypeScript - https://www.typescriptlang.org/
- Next.js - https://nextjs.org/
- React - https://react.dev/
- Tailwind CSS - [tailwindcss.com](http://tailwindcss.com/)
- React-Relay - https://relay.dev/ (use this along with React’s `setState` , no need to use other state management libraries).

For this task, we encourage use of:

- TailwindCSS (instead of using .css directly) - [tailwindcss.com](http://tailwindcss.com/)
- Shadcn (adapted to our own styles) - https://ui.shadcn.com/
- MagicUI (for things like confetti) - https://magicui.design/
- Xterm.js: if needing to show any terminal output - https://xtermjs.org/
- react-stickynode: for the left-side panels that will persist over a scroll

## ⚠️ Important Notes

All the code should be made in Typescript, and should be passing the TS checks (please ensure `pnpm run build` works peroperly. Code should be deployed to Vercel for demonstration of the progress.

Each time that you change a GraphQL query, don’t forget to run `pnpm run relay`

---

As chatted, we have created a Slack channel to communicate. For any questions or blockers, please ping there.

Output the progress after 8 hours of work have passed, and after 16 hours. If more time is needed check beforehand to see what’s the path to take.

**The goal is to understand how we could work together, what’s the iteration like, the pace, and the output of your work on this time.**

### 💪 Lets do our best work!

[Designs](/_designs/AppCreationFlow.pdf)

---
