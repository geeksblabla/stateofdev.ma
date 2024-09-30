<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-17-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<p align="center">
  <a href="https://stateofdev.ma">
  <img width="477" alt="logo" src="https://user-images.githubusercontent.com/11137944/101990595-01f5f280-3ca8-11eb-8873-95a6234fb096.png">
  </a>
</p>
<h2 align="center">
  State Of Dev in Morocco Website
</h2>
<hr />

StateOfDev.ma is a survey centered around software developers in Morocco by GeeksBlaBla Morocco Community.

We wanted to know how we can help and support each other, and overall be able to better respond to developers evolving needs.

The website is built using [AstroJs](https://astro.build/)

## 🚀 Quick start

1.  **Fork and clone the project**

```sh
git clone git@github.com:your-username/stateofdev.ma.git
```

2.  **Configure Project and Start developing.**

- Go to [Firebase Console](https://console.firebase.google.com/) and Create a firebase application, activate anonymous authentication and enable Firestore database on production mode to set data to private by default as we are going to user firebase admin sdk to write data to firestore database.

- Go to Project settings > service accounts > generate new private key and add missed vars to your .env file.

- Go to [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) and create a new site and get your keys.(optional)

- Copy your keys to `.env.local`:

```env
# Client-side Firebase configuration
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=

# Server-side Firebase configuration
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_CERT_URL=
FIREBASE_CLIENT_CERT_URL=

# captcha keys (optional) make sure to set it to false in dev mode
CAPTCHA_ENABLED=false
CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=

```

- Navigate into your new website's directory and start it up.

```sh
cd stateofdev.ma/
pnpm install
pnpm dev
```

3.  **Open the source code and start editing!**

Your website is now running at `http://localhost:4321`

## How the survey works

The survey form submission process is designed to be secure, anonymous, and user-friendly. Here's an overview of how it works:

1. **Session Initialization (Before Start Page)**

   - When the user clicks the `Take part in the survey` button from the home page, they are redirected to the `/before-start` page where they find important information about the survey.
   - A CAPTCHA is displayed to prevent spam submissions(using Cloudflare Turnstile).
   - When the user clicks "Start":
     - An anonymous Firebase authentication session is created.
     - The session token and CAPTCHA token are sent to the server (actions/initialize-session.ts).
     - The server (actions/initialize-session.ts) validates the Firebase session and the CAPTCHA, initializes the session, and sets a session cookie.
     - Upon successful initialization, the user is redirected to the `/survey` page.

2. **Survey Page**

   - The page checks for an active session before displaying the survey form.
   - If no valid session is found, the user is redirected back to the `/before-start` page.
   - With a valid session, the SurveyForm component is rendered.

3. **Survey Form Component**

   - Questions are loaded from YAML files and presented to the user in sections.
   - Based on the question type, the form changes (radio, checkbox, etc.) and shows a text area if the user selects an option that contains "other".
   - At the end of each section, answers are validated and sent to the server (actions/submit-answers.ts).

   ```js
   // example of the data sent to the server
   const answers = {
     "profile-q-0": 1,
     "profile-q-1": 2,
     "profile-q-2": [3, 2], // multiple choice question
     "profile-q-3": 6, // single choice question
     "profile-q-3-other": "text", // other text
     "profile-q-4": null // null if the question is not answered (skip button)
   };
   ```

   For every question, we send the index of choices selected by the user. It should be a number if the question is single choice, and an array of numbers if the question is multiple choice. We also send "other" text if the user selects an option that contains "other" and adds custom text to the text area.

   - The server (actions/submit-answers.ts) verifies the session, processes the answers, and saves them to the Firestore database with the user ID as the document ID. This way, we can avoid duplicate submissions, and in case of a repeat submission, we will only update the existing document.

4. **Completion and Thanks Page**

   - After completing all sections, the user is redirected to the "Thanks" page.
   - A thank you message is displayed along with social sharing options.

## How the results works

Every day at 12:00 AM UTC we run a github action that export data from firestore and the file should look like this:

```json
{
  "results": [
    {
      "profile-q-0": 1,
      "profile-q-1": 2,
      "profile-q-2": [3, 2],
      "profile-q-3": 6,
      "profile-q-3-other": "text",
      "lastSignInTime": "Tue, 17 Sep 2024 11:57:46 GMT",
      "creationTime": "Tue, 17 Sep 2024 11:57:46 GMT",
      "userId": "..."
    },
    ...
  ]
}
```

Then we generate a json file for survey questions with their choices and ids.

```json
{
  "profile-q-0": {
    "label": "What is your gender?",
    "required": true,
    "multiple": false,
    "choices": ["Male", "Female"]
  },
  "profile-q-1": {
    "label": "What is your age?",
    "required": true,
    "choices": [
      "Younger than 18 years",
      "18 to 24 years",
      "25 to 34 years",
      "35 to 44 years",
      "45 or older"
    ],
    "multiple": false
  },
  ...
}
```

Now that we have the results and the questions. we use `getQuestion` in `components/chart/utils.ts` file to get data for any question id then render it using `Chart` component.

## 🧐 Want to contribute ?

If you want to contribute check out the [help wanted](https://github.com/geeksblabla/stateofdev.ma/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Aupdated-desc) issues for things that need fixing, or suggest some new features by opening new issues.

## Licensing

The code in this project is licensed under [MIT license](https://mit-license.org/).

The Data in `./results` is licensed under [ODC-ODbL License](https://opendatacommons.org/licenses/odbl/).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="16.66%"><a href="https://elazizi.com/"><img src="https://avatars0.githubusercontent.com/u/11137944?v=4?s=120" width="120px;" alt="Youssouf EL AZIZI"/><br /><sub><b>Youssouf EL AZIZI</b></sub></a><br /><a href="https://github.com/geeksblabla/stateofdev.ma/commits?author=yjose" title="Code">💻</a> <a href="https://github.com/geeksblabla/stateofdev.ma/commits?author=yjose" title="Documentation">📖</a> <a href="#content-yjose" title="Content">🖋</a> <a href="#ideas-yjose" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="16.66%"><a href="http://aboullaite.me/"><img src="https://avatars0.githubusercontent.com/u/2836850?v=4?s=120" width="120px;" alt="Mohammed Aboullaite"/><br /><sub><b>Mohammed Aboullaite</b></sub></a><br /><a href="https://github.com/geeksblabla/stateofdev.ma/commits?author=aboullaite" title="Code">💻</a> <a href="#content-aboullaite" title="Content">🖋</a> <a href="#ideas-aboullaite" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/ismailElazizi"><img src="https://avatars1.githubusercontent.com/u/22155037?v=4?s=120" width="120px;" alt="Ismail El Azizi"/><br /><sub><b>Ismail El Azizi</b></sub></a><br /><a href="#design-ismailElazizi" title="Design">🎨</a> <a href="#content-ismailElazizi" title="Content">🖋</a> <a href="#ideas-ismailElazizi" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://twitter.com/enlamp"><img src="https://avatars2.githubusercontent.com/u/4036528?v=4?s=120" width="120px;" alt="djalal"/><br /><sub><b>djalal</b></sub></a><br /><a href="#content-djalal" title="Content">🖋</a> <a href="#ideas-djalal" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/iMeriem"><img src="https://avatars1.githubusercontent.com/u/11720929?v=4?s=120" width="120px;" alt="Meriem Zaid"/><br /><sub><b>Meriem Zaid</b></sub></a><br /><a href="#content-iMeriem" title="Content">🖋</a> <a href="#ideas-iMeriem" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/ezzarghili"><img src="https://avatars2.githubusercontent.com/u/8616968?v=4?s=120" width="120px;" alt="Mohamed Ez-zarghili"/><br /><sub><b>Mohamed Ez-zarghili</b></sub></a><br /><a href="#content-ezzarghili" title="Content">🖋</a> <a href="#ideas-ezzarghili" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/Aymane11"><img src="https://avatars2.githubusercontent.com/u/24499930?v=4?s=120" width="120px;" alt="Aymane Boumaaza"/><br /><sub><b>Aymane Boumaaza</b></sub></a><br /><a href="#content-Aymane11" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://blog.zhaytam.com/"><img src="https://avatars3.githubusercontent.com/u/34218324?v=4?s=120" width="120px;" alt="Haytam Zanid"/><br /><sub><b>Haytam Zanid</b></sub></a><br /><a href="#content-zHaytam" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/boredabdel"><img src="https://avatars1.githubusercontent.com/u/1208914?v=4?s=120" width="120px;" alt="Abdelfettah SGHIOUAR"/><br /><sub><b>Abdelfettah SGHIOUAR</b></sub></a><br /><a href="#content-boredabdel" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="http://stackoverflow.com/users/4689497/"><img src="https://avatars0.githubusercontent.com/u/5012992?v=4?s=120" width="120px;" alt="Youness IABITEN"/><br /><sub><b>Youness IABITEN</b></sub></a><br /><a href="#content-Yiabiten" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/Ismailtlem"><img src="https://avatars1.githubusercontent.com/u/34961373?v=4?s=120" width="120px;" alt="Ismail Tlemçani"/><br /><sub><b>Ismail Tlemçani</b></sub></a><br /><a href="#content-Ismailtlem" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://soubai.me/"><img src="https://avatars0.githubusercontent.com/u/11523791?v=4?s=120" width="120px;" alt="Abderrahim SOUBAI"/><br /><sub><b>Abderrahim SOUBAI</b></sub></a><br /><a href="#content-AbderrahimSoubaiElidrissi" title="Content">🖋</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/moutout"><img src="https://avatars.githubusercontent.com/u/3751894?v=4?s=120" width="120px;" alt="Mustapha"/><br /><sub><b>Mustapha</b></sub></a><br /><a href="#content-moutout" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://www.linkedin.com/in/sohayb-elamraoui/"><img src="https://avatars.githubusercontent.com/u/32344494?v=4?s=120" width="120px;" alt="el amraoui Sohayb"/><br /><sub><b>el amraoui Sohayb</b></sub></a><br /><a href="#content-Elamraoui-Sohayb" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="http://yezz.me"><img src="https://avatars.githubusercontent.com/u/52716203?v=4?s=120" width="120px;" alt="Yasser Tahiri"/><br /><sub><b>Yasser Tahiri</b></sub></a><br /><a href="#content-yezz123" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://www.iduoad.com"><img src="https://avatars.githubusercontent.com/u/25715906?v=4?s=120" width="120px;" alt="Mohammed Daoudi"/><br /><sub><b>Mohammed Daoudi</b></sub></a><br /><a href="#content-Iduoad" title="Content">🖋</a></td>
      <td align="center" valign="top" width="16.66%"><a href="https://github.com/bilalix"><img src="https://avatars.githubusercontent.com/u/2496324?v=4?s=120" width="120px;" alt="Bilal"/><br /><sub><b>Bilal</b></sub></a><br /><a href="#content-bilalix" title="Content">🖋</a> <a href="https://github.com/geeksblabla/stateofdev.ma/commits?author=bilalix" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credit

This project is inspired by :

- [Stack Overflow Survey ](https://insights.stackoverflow.com/survey/2020)
- [State of Front-end Survey](https://tsh.io/state-of-frontend/)

```

```
