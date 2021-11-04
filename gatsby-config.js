const config = require("./config/website")
const pathPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: config.siteUrl + pathPrefix,
    title: config.siteTitle,
    twitterHandle: config.twitterHandle,
    description: config.siteDescription,
    keywords: ["Developer", "Morocco", "State"],
    canonicalUrl: config.siteUrl,
    image: config.siteLogo,
    banner: config.banner,
    author: {
      name: config.author,
      minibio: `DevC Casablanca`,
    },
    organization: {
      name: config.organization,
      url: config.siteUrl,
      logo: config.siteLogo,
    },
    social: {
      twitter: config.twitterHandle,
      fbAppID: "",
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-yaml`,
    {
      resolve: "gatsby-plugin-next-seo",
      options: {
        openGraph: {
          type: "website",
          locale: "en_IE",
          url: "https://stateofdev.ma/",
          site_name: "StateOfDevMa",
        },
        twitter: {
          handle: "@geeksblabla",
          site: "@geeksblabla",
          cardType: "summary_large_image",
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/survey`,
        name: `survey`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/results/2020/sections`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/results/articles`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY,
          authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
          appId: process.env.GATSBY_FIREBASE_APP_ID,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `State Of Dev in Morocco`,
        short_name: `StateOfDev.ma`,
        start_url: `/`,
        background_color: `#2cc068`,
        theme_color: `#2cc068`,
        display: `minimal-ui`,
        icon: `src/assets/logo.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-127901499-5",
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts-v2`,
      options: {
        fonts: [
          {
            family: "Inter",
            variable: true,
            weights: ["400..700"],
          },
        ],
      },
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: process.env.GATSBY_SENTRY_DSN,
        sampleRate: 0.7,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          exclude: /\.png$/,
        },
      },
    },
  ],
}
