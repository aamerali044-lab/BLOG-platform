const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const register = (payload) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
export const login = (payload) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
export const getMe = () => request('/auth/me')

export const getPosts = () => request('/posts')
export const getPost = (id) => request(`/posts/${id}`)
export const createPost = (payload) =>
  request('/posts', { method: 'POST', body: JSON.stringify(payload) })
export const updatePost = (id, payload) =>
  request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deletePost = (id) => request(`/posts/${id}`, { method: 'DELETE' })

export const getComments = (postId) => request(`/posts/${postId}/comments`)
export const addComment = (postId, content) =>
  request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) })
export const deleteComment = (id) => request(`/comments/${id}`, { method: 'DELETE' })
