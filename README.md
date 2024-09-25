This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

- Create your own .env file and add this details you get from your firebase project, it should include

    apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
  
- In your .env file add this
   -  NEXT_PUBLIC_FIREBASE_API_KEY= 'your-api-key'
   -  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= 'your-domain- usually blabla bla.com'
   -  NEXT_PUBLIC_FIREBASE_PROJECT_ID= 'add-project-id'
   -  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= 'add storage bucket'
   -  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= 'your-sender-id'
   -  NEXT_PUBLIC_FIREBASE_APP_ID= 'your-app-id'

- run the development server:

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
- For authentication for signup give permission from your fire base to a new mail and password or add a mail to whitelist in the route.ts file

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment
It is deployed on my netlify account and any new push to remote github repo redploys the app, you don't need to do anything, just wait 5-10 minutes after deployment,
you should see your changes
if it doesn't it means there's an error in your code (to know you'd have to contact me as it's my account I used), but as long as you write good code it'll pass.




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



