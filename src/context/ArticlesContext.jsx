import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

// ⚠️ SECURITY ISSUE: This context is shared globally with no user authentication
// All users see the same saved articles!
const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const { user, isAdmin } = useAuth();

  const [savedArticles, setSavedArticles] = useState({});

  const saveArticle = (article) => {
    //setSavedArticles(prev => {
    //  // Check if article is already saved
    //  if (prev.find(a => a.url === article.url)) {
    //    return prev;
    //  }
    //  return [...prev, article];
    //});

    if (!user) {
      return;
    } else {

      const username = user.username;
      setSavedArticles(prev => {
        if (!prev[username]) {
          //const addJSONStr = `{ ${username}: ${article} }`;
          //const addJSON = JSON.parse(addJSONStr);
//
          //return { ...prev, addJSON };
          let newJSON = JSON.parse(JSON.stringify(prev));
          newJSON[username] = [article];

          return newJSON;
        } else {
          let newJSON = JSON.parse(JSON.stringify(prev));
          newJSON[username] = [...newJSON[username], article];

          return newJSON;
        }
      })
    }
  };

  const removeArticle = (url) => {
    //setSavedArticles(prev => prev.filter(a => a.url !== url));
    if (!user) {
      return;
    } else {
      const username = user.username;

      const updatedUserArticles = savedArticles[username].filter(a => {a.url !== url});

      let newJSON = JSON.parse(JSON.stringify(savedArticles));
      newJSON[username] = updatedUserArticles;

      setSavedArticles(newJSON);
    }
  };

  const isArticleSaved = (url) => {
    //return savedArticles.some(a => a.url === url);
    if (!user) {
      return false;
    } else {
      const username = user.username;

      if (!savedArticles[username]) {
        return false;
      } else {

        return savedArticles[username].some(a => a.url === url);
      }
    }
  };

  const getUserSavedArticles = () => {
    if (!user) {
      return [];
    } else {
      const username = user.username

      if (!savedArticles[username]) {
        return [];
      } else {
        return savedArticles[username];
      }
    }
  }

  const getAllUserArticles = () => {
    return savedArticles;
  }

  return (
    <ArticlesContext.Provider 
      value={{ 
        savedArticles, 
        saveArticle, 
        removeArticle, 
        isArticleSaved ,
        getUserSavedArticles,
        getAllUserArticles
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};