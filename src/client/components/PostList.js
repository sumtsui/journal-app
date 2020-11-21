import './PostList.scss';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { POST_LIST } from '../apollo/graphql';
import { formatTime } from '../utils';
import ListItem from './PostListItem';

function PostList() {
  const { data, loading, error, fetchMore } = useQuery(POST_LIST, { notifyOnNetworkStatusChange: true });

  // don't show this loading when fetchMore
  if (loading && !data) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  const {
    postList: { list, cursor }
  } = data;

  return (
    <div className="post-list">
      <Link to="/post/new" className="new-post-btn">
        <button>Add New Post</button>
      </Link>
      {list.map(post => (
        <ListItem key={post.id}>
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="bottom">
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </Link>
        </ListItem>
      ))}
      <div>
        {!loading && list.length > 0 && (
          <button
            onClick={() =>
              fetchMore({
                variables: { filter: { cursor } },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;

                  const newList = [...prev.postList.list, ...fetchMoreResult.postList.list];
                  const newCursor = fetchMoreResult.postList.cursor;
                  const obj = {
                    postList: {
                      list: newList,
                      cursor: newCursor,
                      __typename: prev.postList.__typename
                    }
                  };
                  return obj;
                }
              })
            }
          >
            More
          </button>
        )}
        {loading && 'loading...'}
      </div>
    </div>
  );
}

export default PostList;
