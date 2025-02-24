import { gql } from '@apollo/client';

// 根据 ID 查找文章
export const FIND_ARTICLE_BY_ID = gql`
  query FindArticleById($id: String!) {
    findArticlebyid(id: $id) {
      id
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
  query FindAllArticles($skip: Int, $take: Int) {  # 假设你有分页参数
    findall(skip: $skip, take: $take) {
      id
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
  query FindByTopic($string: String!, $skip: Int, $take: Int) {
    findbytopic(string: $string, skip: $skip, take: $take) {
      topics
    }
  }
`;

// 添加文章
export const ADD_ARTICLE = gql`
  mutation AddArticle($newinputdata: NewsArticleInput!) {
    addArticle(newinputdata: $newinputdata) {
      id
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
    removeArticle(id: $id)
  }
`;

// 订阅新文章
export const RECIPE_ADDED_SUBSCRIPTION = gql`
  subscription RecipeAdded {
    recipeAdded {
      id
    }
  }
`;
