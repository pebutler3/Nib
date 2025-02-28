import React from "react";

export const defaultConfig = {
  config: {
    plugins: {
      options: "block inline link list image table help",
      image: {
        uploadCallback: _ => {}
      }
    },
    toolbar: {
      options: "top",
      top: {
        options: "block inline link list image table history help",
        block: {options: "p h1 h2 h3 h4 h5 h6", grouped: true},
        inline: {options: "strong em underline strike subsup"}
      },
      inline: {
        options: "block inline link list image",
        block: {options: "p h1 h2 h3"},
        inline: {options: "strong em underline"}
      }
    }
  },
  dispatch: undefined
};

export const AppContext = React.createContext(defaultConfig);
