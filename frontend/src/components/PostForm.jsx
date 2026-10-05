import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '../api'

export default function PostForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isEditing) {
      api.getPost(id).then((post) => setForm({ title: post.title, content: post.content }))
    }
  }, [id, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (isEditing) {
        await api.updatePost(id, form)
        navigate(`/posts/${id}`)
      } else {
        const post = await api.createPost(form)
        navigate(`/posts/${post.id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h1>{isEditing ? 'Edit post' : 'Write a new post'}</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          className="post-title-input"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Write your post…"
          rows={14}
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        {error && <p className="form-error">{error}</p>}
        <button className="btn-solid" type="submit" disabled={busy}>
          {busy ? 'Saving…' : isEditing ? 'Save changes' : 'Publish'}
        </button>
      </form>
    </div>
  )
}
