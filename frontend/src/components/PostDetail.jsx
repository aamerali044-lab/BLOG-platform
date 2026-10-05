import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import * as api from '../api'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [status, setStatus] = useState('loading')

  const load = () => {
    Promise.all([api.getPost(id), api.getComments(id)])
      .then(([postData, commentData]) => {
        setPost(postData)
        setComments(commentData)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [id])

  const handleDeletePost = async () => {
    await api.deletePost(id)
    navigate('/')
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    await api.addComment(id, commentText)
    setCommentText('')
    load()
  }

  const handleDeleteComment = async (commentId) => {
    await api.deleteComment(commentId)
    load()
  }

  if (status === 'loading') return <div className="container"><p className="muted">Loading…</p></div>
  if (status === 'error' || !post) return <div className="container"><p className="muted">Post not found.</p></div>

  const isAuthor = user && user.id === post.author.id

  return (
    <div className="container">
      <article className="post-full">
        <h1>{post.title}</h1>
        <div className="byline">
          By {post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="post-body">
          {post.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {isAuthor && (
          <div className="post-owner-actions">
            <Link to={`/posts/${id}/edit`} className="btn-ghost">Edit</Link>
            <button className="btn-ghost btn-danger" onClick={handleDeletePost}>Delete</button>
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2 className="comments-heading">Letters ({comments.length})</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              placeholder="Add a comment…"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn-solid btn-small" type="submit">Post comment</button>
          </form>
        ) : (
          <p className="muted"><Link to="/login">Log in</Link> to leave a comment.</p>
        )}

        <div className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-row">
              <div>
                <span className="comment-author">{c.author.username}</span>
                <span className="muted"> · {new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{c.content}</p>
              {user && user.id === c.author.id && (
                <button className="link-btn" onClick={() => handleDeleteComment(c.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
