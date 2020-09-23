const recipes = require('gatsby-recipes');
const { bootstrap } = require('gatsby/dist/bootstrap');
const reporter = require('gatsby-cli/lib/reporter');
const redux = require('gatsby/dist/redux');
const { setStore } = require('gatsby-cli/lib/reporter/redux');
const { GraphQLRunner } = require('gatsby/dist/query/graphql-runner');
const path = require('path');

module.exports = async function buildQueryExecutor(apiToken) {
  const gatsbyProjectPath = path.resolve(path.join(__dirname, '../fixtures/sample-gatsby-structure'));
  process.chdir(gatsbyProjectPath);

  process.env.DATOCMS_API_TOKEN = apiToken;

  recipes.startGraphQLServer('.', true);

  await bootstrap({
    program: {
      directory: gatsbyProjectPath,
      report: reporter,
      setStore,
    },
  });

  const runner = new GraphQLRunner(redux.store, { graphqlTracing: false });

  return async query => {
    const result = await runner.query(query, {}, {});
    return result;
  };
}
