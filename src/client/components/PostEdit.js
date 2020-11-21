import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { POST_LIST, POST, UPDATE_POST, DELETE_POST } from '../apollo/graphql';
import { useHistory, useRouteMatch } from 'react-router-dom';

function PostEdit() {
  const history = useHistory();
  const { params } = useRouteMatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const post = useQuery(POST, {
    variables: { id: params.id }
  });
  const [updatePost, updatePostResponse] = useMutation(UPDATE_POST, {
    onCompleted: () => history.push(`/post/${params.id}`)
  });
  const [deletePost, deletePostResponse] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      const { postList } = cache.readQuery({ query: POST_LIST });
      const obj = { ...postList };
      obj.list = obj.list.filter(p => p.id !== deletePost);
      obj.cursor = obj.cursor - 1;
      cache.writeQuery({
        query: POST_LIST,
        data: { postList: { ...obj } }
      });
    },
    onCompleted: () => history.push('/')
  });

  useEffect(() => {
    if (post.data && post.data.post) {
      setTitle(post.data.post.title);
      setContent(post.data.post.content);
    }
  }, [post]);

  function onSaveClick(evt) {
    evt.preventDefault();
    update();
  }

  function update() {
    const post = { title, content };
    const id = params.id;
    updatePost({
      variables: { id, post }
    });
  }

  function onDeleteClick() {
    const result = window.confirm('Are you sure?');
    if (result) {
      deletePost({
        variables: { id: params.id }
      });
    }
  }

  function onCancelClick() {
    history.push(`/post/${params.id}/`);
  }

  if (post.loading) {
    return <div>Loading...</div>;
  }

  if (updatePostResponse.loading) {
    return <div>Saving...</div>;
  }

  if (updatePostResponse.error) {
    return <div>Error updating post.</div>;
  }

  if (deletePostResponse.loading) {
    return <div>Deleting...</div>;
  }

  if (deletePostResponse.error) {
    return <div>Error deleting post.</div>;
  }

  return (
    <form className="single-post edit">
      <input
        className="title"
        placeholder="Title"
        value={title}
        onChange={evt => setTitle(evt.target.value)}
        type="text"
        required
      />
      <textarea
        className="content"
        placeholder="Content"
        value={content}
        rows={10}
        onChange={evt => setContent(evt.target.value)}
        required
      />
      <div className="form-bottom">
        <button type="submit" onClick={onSaveClick}>
          Save
        </button>
        <button onClick={onCancelClick}>Cancel</button>
        <button onClick={onDeleteClick}>Delete</button>
      </div>
    </form>
  );
}

export default PostEdit;
