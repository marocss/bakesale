const apiHost = 'https://bakesaleforgood.com';

export default {
  async fetchInitialDeals() {
    try {
      const response = await fetch(apiHost + '/api/deals');
      console.log(response);

      const responseJson = await JSON.parse(response);

      return responseJson;
    } catch (error) {
      console.log(error);
    }
  },
};
