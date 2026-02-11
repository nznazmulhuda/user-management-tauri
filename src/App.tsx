import React, { useState, useEffect } from 'react'
import './App.css'
import { VITE_BACKEND_URL } from './config/env'

interface User {
  id: number | string;
  username: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({ username: '', email: '' })
  const [editingId, setEditingId] = useState<number | string | null>(null)

  const fetchUsers = async () => {
    const res = await fetch(`${VITE_BACKEND_URL}/users`)
    const data = await res.json()
    setUsers(data)
    console.log('Fetching users...')
  }

  const createUser = async (user: Omit<User, 'id'>) => {
    await fetch(`${VITE_BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user })
    })

    const newUser = { ...user, id: Date.now() }
    setUsers([...users, newUser])
  }

  const updateUser = async (id: number | string, user: Omit<User, 'id'>) => {
    await fetch(`${VITE_BACKEND_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })

    setUsers(users.map(u => u.id === id ? { ...u, ...user } : u))
  }

  const deleteUser = async (id: number | string) => {
    await fetch(`${VITE_BACKEND_URL}/users/${id}`, { method: 'DELETE' })

    setUsers(users.filter(u => u.id !== id))
  }

  // --- HANDLERS ---

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.email) return

    if (editingId !== null) {
      await updateUser(editingId, formData)
      setEditingId(null)
    } else {
      await createUser(formData)
    }
    setFormData({ username: '', email: '' })
  }

  const handleEdit = (user: User) => {
    setFormData({ username: user.username, email: user.email })
    setEditingId(user.id)
  }

  const handleDelete = (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Dashboard</h1>
        <p>Manage your team members and their account permissions here.</p>
      </header>

      <div className="content-wrapper">
        <aside className="form-sidebar">
          <div className="card form-card">
            <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Alex Morgan"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. alex@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update User' : 'Create User'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ username: '', email: '' })
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <main className="user-grid-section">
          <div className="section-header">
            <h2>All Users</h2>
            <span className="badge">{users.length} Total</span>
          </div>

          <div className="user-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user)} className="icon-btn edit-btn" title="Edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="icon-btn delete-btn" title="Delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="empty-state">
                <p>No users found. Start by adding one!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App