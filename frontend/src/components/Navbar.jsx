import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link to="/" className="masthead-title">The Margin</Link>
        <nav className="masthead-nav">
          {user ? (
            <>
              <Link to="/new">Write</Link>
              <span className="byline-name">{user.username}</span>
              <button className="link-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </div>
      <div className="masthead-rule" />
    </header>
  )
}
