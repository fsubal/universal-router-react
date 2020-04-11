export default {
  input: "src/index.tsx",
  plugins: {
    typescript2: {
      objectHashIgnoreUnknownHack: false,
    },
  },
  output: {
    format: ["cjs-min", "esm-min"],
  },
};
