This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



### DATA EXPORT FROM FIREBASE IN FUTURE USING NODE.JS


Install the node-firestore-import-export library installed on your machine. You can install it by running npm install -g node-firestore-import-export.
Next

- Open the Firebase Console.
- Navigate to your project and click the gear icon next to the “Project Overview” heading.
- Click the “Project Settings” button.
- In the “Service accounts” tab, click the “Generate new private key” button. This will download a JSON file with your Firebase project’s configuration.
- Rename the downloaded file to appConfig.json.
- Open a terminal and navigate to the directory where you want to save the exported JSON file. Make sure the above file you just renamed exists in the same directory as well.
- Run the following command to export data from your Firestore database:
##### npx -p node-firestore-import-export firestore-export -a appConfig.json -b backup.json

Your data will be stored in a file named backup.json and you get something like this image in your terminal
![image](https://github.com/user-attachments/assets/4e9877c3-b952-4f17-94f6-562bfa219db6).

If you need more help checkout this link
https://malcolmmaima.medium.com/how-to-export-data-from-firebase-firestore-database-in-json-format-using-node-18b73e181c09



