import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const modules = {};

const requireModule = require.context("./modules", false, /\.js$/);
requireModule.keys().forEach((fileName) => {
  const moduleName = fileName.replace(/(\.\/|\.js)/g, "");
  const moduleConfig = requireModule(fileName);
  modules[moduleName] = moduleConfig.default || moduleConfig;
});

export default function () {
  const Store = new Vuex.Store({
    modules,
    strict: process.env.DEBUGGING,
  });

  return Store;
}
