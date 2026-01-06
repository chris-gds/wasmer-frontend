import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const network = Network.create(async (params, variables) => {
  const response = await fetch('https://your-graphql-endpoint.com/graphql', { // Replace with your endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });
  return response.json();
});

const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default environment;
