import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'

function excerpt(text, len = 180) {
  if (text.length <= len) return text
  return text.slice(0, len).trim() + '…'
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api
      .getPosts()
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="container">
      <div className="issue-label">Latest issue</div>

      {status === 'loading' && <p className="muted">Loading posts…</p>}
      {status === 'error' && <p className="muted">Couldn't load posts. Is the backend running?</p>}
      {status === 'ready' && posts.length === 0 && (
        <p className="muted">No posts yet — be the first to write one.</p>
      )}

      <div className="post-feed">
        {posts.map((post) => (
          <article key={post.id} className="post-preview">
            <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
            <div className="byline">
              By {post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <p>{excerpt(post.content)}</p>
            <Link to={`/posts/${post.id}`} className="read-more">Continue reading →</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
