const config = require("./config/website")
const pathPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix

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
      resolve: `gatsby-plugin-recaptcha`,
      options: {
        async: false,
        defer: false,
        args: `?onload=onloadCallback&render=explicit`,
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyC76pMk1fuqlp88cUPAxWrg4-g3U9MaQ3Y",
          authDomain: "survey-test-1.firebaseapp.com",
          databaseURL: "https://survey-test-1.firebaseio.com",
          projectId: "survey-test-1",
          storageBucket: "survey-test-1.appspot.com",
          messagingSenderId: "99106324234",
          appId: "1:99106324234:web:6f13412b2a161afe6e44f3",
        },
      },
    }, //   resolve: `gatsby-plugin-google-analytics`, // {
    //   options: {
    //     trackingId: "UA-127901499-3",
    //   },
    // },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Open Sans`,
            variants: [`400`, `600`, `700`],
          },
        ],
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
