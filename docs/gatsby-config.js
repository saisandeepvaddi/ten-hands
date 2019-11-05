module.exports = {
  pathPrefix: "/ten-hands",
  siteMetadata: {
    title: `Ten Hands`,
    description: `One place to run your command-line tasks`,
    author: `@saisandeepvaddi`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#202B33`,
        theme_color: `#202B33`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     // replace "UA-XXXXXXXXX-X" with your own Tracking ID
    //     trackingId: "UA-99985724-4",
    //   },
    // },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-NJ38486",

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
