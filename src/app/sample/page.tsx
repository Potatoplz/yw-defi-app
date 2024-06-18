"use client";
import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const SamplePage: React.FC = () => {
  const {
    data: posts,
    error,
    loading,
    fetch: fetchSample,
  } = useApi<Post[]>("postsApi");

  useEffect(() => {
    fetchSample("/posts");
  }, [fetchSample]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Posts List</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SamplePage;
