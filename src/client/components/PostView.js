import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { POST } from '../apollo/graphql';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { formatTime } from '../utils';
import sanitizeHtml from 'sanitize-html';

function PostView() {
  const { params } = useRouteMatch();
  const history = useHistory();
  const { data, loading, error } = useQuery(POST, {
    variables: { id: params.id }
  });

  function onEditClick() {
    history.push(`/post/${params.id}/edit`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading post.</div>;
  }

  return (
    <div className="single-post">
      <h3 className="title">{data.post.title}</h3>
      <div className="info">
        <span style={{ marginRight: '1em' }}>{formatTime(data.post.createdAt)}</span>
        <span>Author: {data.post.author}</span>
      </div>
      {/* <p className="content">{data.post.content}</p> */}
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.post.content) }} />
      <div className="form-bottom">
        <button onClick={onEditClick}>Edit</button>
      </div>
    </div>
  );
}

export default PostView;
