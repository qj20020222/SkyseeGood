// apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // 用于添加认证头 (可选)

const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:3000/graphql', // 你的 GraphQL 服务器地址.  必须!
});

// (可选) 添加认证头.  如果你的 API 不需要认证，可以完全删除 authLink
/*const authLink = setContext((_, { headers }) => {
  // 获取 token (例如，从 AsyncStorage 中)
  const token = ''; // 从你的存储中获取 token。 如果不需要认证，这行也可以删掉。

  // 返回 headers
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});*/

const client = new ApolloClient({
  link: httpLink, // 如果不需要认证，直接写 link: httpLink
  cache: new InMemoryCache() // 必须!
});
console.log('创建成功')
export default client;
