// pages/login.js
import { useState } from 'react'
import supabase from '../supabaseClient'
import styles from '../styles/Login.module.css' // Adjust the path as necessary
import { useRouter } from 'next/router'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
  
    const handleLogin = async (e) => {
      e.preventDefault()
      console.log("Clicked login button")
  
      // Attempt to log in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
  
      if (error) {
        alert('Login failed: ' + error.message)
      } else {
        // Check if the user is logged in correctly
        if (data.user) {
            console.log('User logged in:', data.user)
            if (data.user.role === 'authenticated') {
              console.log('User is authenticated')
              router.push('/admin') // Redirect to admin page after successful login
              window.location.href = '/admin' // Redirect to admin page after successful login
              console.log('Redirecting to admin page')
            }
        } else {
          alert('Login failed: User data is not available')
        }
      }
    }
  
    return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2 className={styles.title}>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    )
  }
