// src/composables/useCustomer.ts
import { computed } from 'vue'

export type CustomerState = {
  email: string
  firstName: string | null
  lastName: string | null
  role?: "user" | "admin"
}

// Resposta de /api/auth/me
type MeResponse = {
  loggedIn: boolean
  customer: CustomerState | null
}

// Resposta genèrica de login (i que reutilitzarem per updateProfile mock)
type LoginResponse =
  | {
      ok: true
      customer: CustomerState
    }
  | {
      ok: false
      error: string
      message: string
    }

type RegisterPayload = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}    

/**
 * Mock users Table
 */
const Customers: Array<{
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
}> = [
  {
    id: "u1",
    email: "demo.user@piella.demo",
    password: "demo123",
    firstName: "Clara",
    lastName: "Client",
    role: "user"
  },
  {
    id: "u2",
    email: "demo.admin@piella.demo",
    password: "admin123",
    firstName: "Arnau",
    lastName: "Admin",
    role: "admin"
  },
  {
    id: "u3",
    email: "flequer@piella.demo",
    password: "paiforn123",
    firstName: "Marta",
    lastName: "Flequera",
    role: "admin"
  }
]

// Payloads per futurs endpoints (Shopify / API pròpia)
export type UpdateProfilePayload = {
  firstName?: string | null
  lastName?: string | null
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

type ChangePasswordResponse =
  | { ok: true }
  | { ok: false; error: string; message: string }

export function useCustomer() {
  // Shared state across the app
  const config = useRuntimeConfig()
  const _serverMode = config.public.serverMode   
  const isServer = (_serverMode === 'server')
  const isServerless = !isServer
  // console.log('[useCustomer] serverMode =', _serverMode)
  const customer = useState<CustomerState | null>(
    'customer',
    () => null,
  )

  const loading = useState<boolean>(
    'customerLoading',
    () => false,
  )

  const initialized = useState<boolean>(
    'customerInitialized',
    () => false,
  )

  const isLoggedIn = computed(() => !!customer.value)

  // ---------------------------------------------------------------------------
  // Hydrate from server (/api/auth/me)
  // ---------------------------------------------------------------------------
  async function hydrate(force = false): Promise<void> {
    if (isServerless){
      loading.value = true
      customer.value = null
      initialized.value = true
      loading.value = false
      return
    }

    if (initialized.value && !force) return

    loading.value = true
    try {
      const res = await $fetch<MeResponse>('/api/auth/me')

      if (res.loggedIn && res.customer) {
        customer.value = res.customer
      } else {
        customer.value = null
      }

      initialized.value = true
    } catch (err) {
      console.error('useCustomer.hydrate error:', err)
      customer.value = null
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Login → /api/auth/login (mock)
  // ---------------------------------------------------------------------------
  async function login(
    email: string,
    password: string,
  ): Promise<LoginResponse> {
    loading.value = true
    try {
      let res
      if (isServerless){
        const foundUser = Customers.find((e,i)=> {

          return e.email.toLowerCase() == email.toLowerCase()
        })
        if (!foundUser){
          res = {
            ok: false,
            error: "INALID_CREDENTIALS",
            message: "Email o clau incorrectes"
          }
        }else{
          const mockCustomer: CustomerState = {
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            role: foundUser.role,        // 👈 aquí entra el 'admin' o 'user'
          }

          customer.value = mockCustomer
          initialized.value = true
          return  {
            ok : true,
            "customer" : customer.value 
          }
        }
      }

      res = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (res.ok) {
        customer.value = res.customer
        initialized.value = true
        return res
      }

      // Backend returned ok: false
      return res
    } catch (err: any) {
      console.error('useCustomer.login error:', err)
      return {
        ok: false,
        error: 'NETWORK_ERROR',
        message: err?.message ?? 'Unknown error',
      }
    } finally {
      loading.value = false
    }
  }
  // ---------------------------------------------------------------------------
  // register → /api/auth/register (mock)
  // ---------------------------------------------------------------------------
  async function register(
    payload: RegisterPayload,
  ): Promise<LoginResponse> {
    loading.value = true
    try {
      // 🔹 MOCK pura: no cridem cap /api, creem un client de demo
      const mockCustomer: CustomerState = {
        email: payload.email,
        firstName: payload.firstName ||null,

          // ?? payload.email.split('@')[0]
          // ?? null,
        lastName: payload.lastName || null,
      }

      customer.value = mockCustomer
      initialized.value = true

      return {
        ok: true,
        customer: mockCustomer,
      }
    } catch (err: any) {
      console.error('useCustomer.register error:', err)
      return {
        ok: false,
        error: 'REGISTER_ERROR',
        message: err?.message ?? 'Unknown error',
      }
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Logout → /api/auth/logout
  // ---------------------------------------------------------------------------
  async function logout(): Promise<void> {
    loading.value = true
    try {
      if ( isServerless){
        customer.value = null
        initialized.value = false
      }else{
        await $fetch('/api/auth/logout', {
          method: 'POST',
        })
        customer.value = null
        initialized.value = false
      }
    } catch (err) {
      console.error('useCustomer.logout error:', err)
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Update profile (mock local, mateixa signatura base per futur Shopify)
  // ---------------------------------------------------------------------------
  async function updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<LoginResponse> {
    if (!customer.value) {
      return {
        ok: false,
        error: 'NOT_LOGGED_IN',
        message: 'User is not logged in',
      }
    }

    loading.value = true
    try {
      // De moment no truquem cap API real.
      // Simplement actualitzem l’estat local (mock).
      const updated: CustomerState = {
        ...customer.value,
        firstName:
          payload.firstName !== undefined
            ? payload.firstName
            : customer.value.firstName,
        lastName:
          payload.lastName !== undefined
            ? payload.lastName
            : customer.value.lastName,
      }

      customer.value = updated

      return {
        ok: true,
        customer: updated,
      }
    } catch (err: any) {
      console.error('useCustomer.updateProfile error:', err)
      return {
        ok: false,
        error: 'UPDATE_PROFILE_ERROR',
        message: err?.message ?? 'Unknown error',
      }
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Change password (mock local, sense efecte real)
  // ---------------------------------------------------------------------------
  async function changePassword(
    _payload: ChangePasswordPayload,
  ): Promise<ChangePasswordResponse> {
    if (!customer.value) {
      return {
        ok: false,
        error: 'NOT_LOGGED_IN',
        message: 'User is not logged in',
      }
    }

    loading.value = true
    try {
      // Mock – aquí en el futur cridaries l’endpoint real
      // (Shopify /api/auth/change-password, etc.)
      return { ok: true }
    } catch (err: any) {
      console.error('useCustomer.changePassword error:', err)
      return {
        ok: false,
        error: 'CHANGE_PASSWORD_ERROR',
        message: err?.message ?? 'Unknown error',
      }
    } finally {
      loading.value = false
    }
  }

  return {
    customer,
    loading,
    initialized,
    isLoggedIn,

    hydrate,
    login,
    logout,
    updateProfile,
    changePassword,
    register,
  }
}
