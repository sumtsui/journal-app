import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { POST_LIST, CREATE_POST } from '../apollo/graphql';
import { useHistory } from 'react-router-dom';

function PostNew() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createPost, newPostRespone] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      const { postList } = cache.readQuery({ query: POST_LIST });
      const obj = { ...postList };
      obj.list = [createPost, ...postList.list];
      obj.cursor = obj.cursor + 1;
      cache.writeQuery({
        query: POST_LIST,
        data: { postList: { ...obj } }
      });
    },
    onCompleted: ({ createPost }) => history.push(`/post/${createPost.id}`)
  });

  function onSaveClick(evt) {
    evt.preventDefault();
    add();
  }

  function add() {
    const newPost = { title, content };
    createPost({
      variables: { newPost },
      optimisticResponse: {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          id: Math.floor(Math.random() * 1000) + '',
          title,
          content,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime()
        }
      }
    }).catch(err => console.log(err));
  }

  function onCancelClick() {
    history.push('/');
  }

  if (newPostRespone.loading) {
    return <div>Saving...</div>;
  }

  if (newPostRespone.error) {
    return <div>Error saving new post.</div>;
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
      </div>
    </form>
  );
}

export default PostNew;
