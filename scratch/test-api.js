const axios = require('axios');

const config = {
  rapidApi: {
    key:  'c884b018eemshc5207a81b6e1ef9p1cebcbjsn3f6ab007f0dc',
    host: 'jsearch.p.rapidapi.com',
  }
};

async function testJSearch() {
  const options = {
    method: 'GET',
    url: `https://${config.rapidApi.host}/search`,
    params: {
      query: 'Software Developer in India',
      page: '1',
      num_pages: '1'
    },
    headers: {
      'x-rapidapi-key': config.rapidApi.key,
      'x-rapidapi-host': config.rapidApi.host
    }
  };

  try {
    console.log('--- Testing JSearch API ---');
    const response = await axios.request(options);
    const jobs = response.data.data || [];
    
    console.log(`Successfully fetched ${jobs.length} jobs.`);
    if (jobs.length > 0) {
      console.log('Sample Job:');
      console.log(`- Title: ${jobs[0].job_title}`);
      console.log(`- Company: ${jobs[0].employer_name}`);
      console.log(`- Location: ${jobs[0].job_city}, ${jobs[0].job_country}`);
    }
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
  }
}

testJSearch();
