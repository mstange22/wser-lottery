import axios from "axios";

export default {
  initialize: () => axios.get('init'),
  doSimulation: () => axios.get('simulator'),
};
