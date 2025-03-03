import { gql } from '@apollo/client';

// 根据 ID 查找文章
export const FIND_ARTICLE_BY_ID = gql`
  query FindArticleById($id: String!) {
    findArticlebyid(id: $id) {
      _id
      topics
      publishedDate
      job
      url
      context
      location
      description
      salary
      company
    }
  }
`;

// 查找所有文章
export const FIND_ALL_ARTICLES = gql`
  query FindAllArticles($skip: Int!, $take: Int!) {  # 假设你有分页参数
    findall(skip: $skip, take: $take) {
      _id
      topics
      publishedDate
      job
      url
      context
      location
      description
      salary
      company
    }
  }
`;

// 根据主题查找文章
export const FIND_BY_TOPIC = gql`
  query FindByTopic($topic: String!, $skip: Int!,  
    $take: Int!) {
    findbytopic(topic: $topic, skip: $skip,
      take: $take) {
      _id
      topics
      publishedDate
      job
      url
      context
      location
      description
      salary
      company
    }
  }
`;

// 添加文章
export const ADD_ARTICLE = gql`
  mutation AddArticle($newinputdata: NewsArticleInput!) {
    addArticle(newinputdata: $newinputdata) {
      _id
      topics
      publishedDate
      job
      url
      context
      location
      description
      salary
      company
    }
  }
`;

// 删除文章
export const REMOVE_ARTICLE = gql`
  mutation RemoveArticle($id: String!) {
    removeArticle(_id: $id)
  }
`;

// 订阅新文章
export const RECIPE_ADDED_SUBSCRIPTION = gql`
  subscription RecipeAdded {
    recipeAdded {
      _id
    }
  }
`;

export const GET_ARTICLE_BY_CV = gql`
    query FindbyCV ($filename: String!, $filetype: String!) {
      findbyCV(filename: $filename, filetype: $filetype) {
          url
      }
    }
`;

export const FIND_BY_URL_ARRAY = gql`
        query Findbyurlarray ($urls: [String!]!) {
            findurlarray(urls: $urls){
                  _id
                  topics
                  publishedDate
                  job
                  url
                  context
                  location
                  description
                  salary
                  company             
            }
        }
`;

