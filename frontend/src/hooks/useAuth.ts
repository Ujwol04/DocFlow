import { useCallback, useEffect, useState } from "react"
import { useLocalStorage } from "@Hooks/useLocalStorage"

interface StoredUser {
  email: string
  name: string
}

interface AccountRecord {
  name: string
  email: string
  salt: string
  hash: string
  recoverySalt?: string
  recoveryHash?: string
}

interface Attempts {
  count: number
  lockUntil: number
}

const ACCOUNTS_KEY = "authAccounts"
const ATTEMPTS_KEY = "authAttempts"
const RESET_ATTEMPTS_KEY = "authResetAttempts"
const SESSION_MS = 30 * 60 * 1000
const MAX_ATTEMPTS = 5
const LOCK_MS = 60 * 1000
const DUMMY_SALT = "00".repeat(16)
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

function randomSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)))
}

function generateRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const chars = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length])
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join("")).join("-")
}

const normalizeCode = (code: string) => code.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

async function hashPassword(password: string, saltHex: string) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" },
    key,
    256
  )
  return toHex(bits)
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function assertNotLocked(key: string): Attempts {
  const attempts = readJson<Attempts>(key, { count: 0, lockUntil: 0 })
  if (attempts.lockUntil > Date.now()) {
    const secs = Math.ceil((attempts.lockUntil - Date.now()) / 1000)
    throw new Error(`LOCKED:${secs}`)
  }
  return attempts
}

function recordFailure(key: string, attempts: Attempts) {
  const count = attempts.count + 1
  writeJson(key, {
    count: count >= MAX_ATTEMPTS ? 0 : count,
    lockUntil: count >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0,
  })
}

async function makeRecovery() {
  const code = generateRecoveryCode()
  const recoverySalt = randomSalt()
  const recoveryHash = await hashPassword(normalizeCode(code), recoverySalt)
  return { code, recoverySalt, recoveryHash }
}

export function useAuth() {
  const [token, setToken] = useLocalStorage<string | null>("authToken", null)
  const [expiresAt, setExpiresAt] = useLocalStorage<number | null>("authExpiresAt", null)
  const [user, setUser] = useLocalStorage<StoredUser | null>("authUser", null)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000)
    return () => clearInterval(id)
  }, [])

  const startSession = useCallback(
    (u: StoredUser) => {
      setToken(crypto.randomUUID())
      setExpiresAt(Date.now() + SESSION_MS)
      setUser(u)
    },
    [setToken, setExpiresAt, setUser]
  )

  // Returns the recovery code. Show it to the user once; only its hash is stored.
  const register = useCallback(
    async (name: string, email: string, password: string): Promise<string> => {
      const normalized = email.trim().toLowerCase()
      const accounts = readJson<AccountRecord[]>(ACCOUNTS_KEY, [])
      if (accounts.some((a) => a.email === normalized)) {
        throw new Error("EMAIL_EXISTS")
      }
      const salt = randomSalt()
      const hash = await hashPassword(password, salt)
      const { code, recoverySalt, recoveryHash } = await makeRecovery()
      writeJson(ACCOUNTS_KEY, [
        ...accounts,
        { name: name.trim(), email: normalized, salt, hash, recoverySalt, recoveryHash },
      ])
      startSession({ email: normalized, name: name.trim() })
      return code
    },
    [startSession]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const attempts = assertNotLocked(ATTEMPTS_KEY)

      const normalized = email.trim().toLowerCase()
      const accounts = readJson<AccountRecord[]>(ACCOUNTS_KEY, [])
      const account = accounts.find((a) => a.email === normalized)

      // Always hash, even for unknown emails, so timing doesn't reveal which accounts exist
      const hash = await hashPassword(password, account?.salt ?? DUMMY_SALT)
      const ok = !!account && safeEqual(hash, account.hash)

      if (!ok) {
        recordFailure(ATTEMPTS_KEY, attempts)
        throw new Error("INVALID_CREDENTIALS")
      }

      writeJson(ATTEMPTS_KEY, { count: 0, lockUntil: 0 })
      startSession({ email: account.email, name: account.name })
    },
    [startSession]
  )

  // Returns a NEW recovery code (the old one stops working).
  const resetPassword = useCallback(
    async (email: string, recoveryCode: string, newPassword: string): Promise<string> => {
      const attempts = assertNotLocked(RESET_ATTEMPTS_KEY)

      const normalized = email.trim().toLowerCase()
      const accounts = readJson<AccountRecord[]>(ACCOUNTS_KEY, [])
      const account = accounts.find((a) => a.email === normalized)

      const hash = await hashPassword(
        normalizeCode(recoveryCode),
        account?.recoverySalt ?? DUMMY_SALT
      )
      const ok = !!account && !!account.recoveryHash && safeEqual(hash, account.recoveryHash)

      if (!ok) {
        recordFailure(RESET_ATTEMPTS_KEY, attempts)
        throw new Error("INVALID_RECOVERY")
      }

      const salt = randomSalt()
      const newHash = await hashPassword(newPassword, salt)
      const { code, recoverySalt, recoveryHash } = await makeRecovery()

      writeJson(
        ACCOUNTS_KEY,
        accounts.map((a) =>
          a.email === normalized ? { ...a, salt, hash: newHash, recoverySalt, recoveryHash } : a
        )
      )
      writeJson(RESET_ATTEMPTS_KEY, { count: 0, lockUntil: 0 })
      writeJson(ATTEMPTS_KEY, { count: 0, lockUntil: 0 })
      return code
    },
    []
  )

  const logout = useCallback(() => {
    setToken(null)
    setExpiresAt(null)
    setUser(null)
  }, [setToken, setExpiresAt, setUser])

  return {
    isAuthenticated: !!token && !!expiresAt && expiresAt > now,
    user,
    login,
    register,
    resetPassword,
    logout,
  }
}