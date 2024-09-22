/* eslint-disable */

import axios from "axios";

const url = require("../../../config").url;

const state = {
  items: [],
  item: {}
};

const endpoint = "consumers";

const getters = {
  consumer: (state) => state.item,
};

const actions = {
  async getItem({ commit }, data) {
    try {
      const response = await axios.get(`${url}/${endpoint}`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  async getItemById({ commit }, id) {
    try {
      const response = await axios.get(`${url}/${endpoint}/${id}`);
      commit("SET_ITEM", response.data.result)
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  async getStockItems({ commit }, id) {
    try {
      const response = await axios.get(`${url}/${endpoint}/${id}/product`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  async addItem({ commit }, data) {
    try {
      const response = await axios.post(`${url}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.log(error)
      return error.response;
    }
  },

  async updateItem({ commit }, data) {
    try {
      const response = await axios.put(`${url}/${endpoint}/${data.id}`, data.data);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  async deleteItem({ commit }, id) {
    try {
      const response = await axios.delete(`${url}/${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
};

const mutations = {
  SET_ITEM(state, data) {
    state.item = data;
  },
};



export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
