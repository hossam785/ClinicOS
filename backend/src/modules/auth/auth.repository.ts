import type { Tenant, User, UserInvitation, PasswordResetToken, UserSession } from './auth.types'

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>
  create(tenant: Tenant): Promise<Tenant>
  update(tenant: Tenant): Promise<Tenant>
  existsByName(name: string): Promise<boolean>
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
}

export interface IInvitationRepository {
  findByToken(token: string): Promise<UserInvitation | null>
  create(invitation: UserInvitation): Promise<UserInvitation>
  update(invitation: UserInvitation): Promise<UserInvitation>
}

export interface IPasswordResetRepository {
  findByToken(token: string): Promise<PasswordResetToken | null>
  create(resetToken: PasswordResetToken): Promise<PasswordResetToken>
  update(resetToken: PasswordResetToken): Promise<PasswordResetToken>
  invalidateAllForUser(userId: string): Promise<void>
}

export interface ISessionRepository {
  findByToken(token: string): Promise<UserSession | null>
  create(session: UserSession): Promise<UserSession>
  deleteByToken(token: string): Promise<void>
}

// In-Memory Data Store representing Database Storage conceptually
const tenantsStore: Map<string, Tenant> = new Map()
const usersStore: Map<string, User> = new Map()
const invitationsStore: Map<string, UserInvitation> = new Map()
const resetTokensStore: Map<string, PasswordResetToken> = new Map()
const sessionsStore: Map<string, UserSession> = new Map()

export const TenantRepository: ITenantRepository = {
  async findById(id: string) {
    return tenantsStore.get(id) || null
  },
  async create(tenant: Tenant) {
    tenantsStore.set(tenant.id, tenant)
    return tenant
  },
  async update(tenant: Tenant) {
    tenantsStore.set(tenant.id, tenant)
    return tenant
  },
  async existsByName(name: string) {
    return Array.from(tenantsStore.values()).some((t) => t.name.toLowerCase() === name.toLowerCase())
  },
}

export const UserRepository: IUserRepository = {
  async findById(id: string) {
    return usersStore.get(id) || null
  },
  async findByEmail(email: string) {
    return Array.from(usersStore.values()).find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  },
  async create(user: User) {
    usersStore.set(user.id, user)
    return user
  },
  async update(user: User) {
    usersStore.set(user.id, user)
    return user
  },
}

export const InvitationRepository: IInvitationRepository = {
  async findByToken(token: string) {
    return Array.from(invitationsStore.values()).find((i) => i.token === token) || null
  },
  async create(invitation: UserInvitation) {
    invitationsStore.set(invitation.id, invitation)
    return invitation
  },
  async update(invitation: UserInvitation) {
    invitationsStore.set(invitation.id, invitation)
    return invitation
  },
}

export const PasswordResetRepository: IPasswordResetRepository = {
  async findByToken(token: string) {
    return Array.from(resetTokensStore.values()).find((rt) => rt.token === token) || null
  },
  async create(resetToken: PasswordResetToken) {
    resetTokensStore.set(resetToken.id, resetToken)
    return resetToken
  },
  async update(resetToken: PasswordResetToken) {
    resetTokensStore.set(resetToken.id, resetToken)
    return resetToken
  },
  async invalidateAllForUser(userId: string) {
    Array.from(resetTokensStore.values())
      .filter((rt) => rt.userId === userId)
      .forEach((rt) => {
        rt.status = 'EXPIRED'
        resetTokensStore.set(rt.id, rt)
      })
  },
}

export const SessionRepository: ISessionRepository = {
  async findByToken(token: string) {
    return Array.from(sessionsStore.values()).find((s) => s.token === token) || null
  },
  async create(session: UserSession) {
    sessionsStore.set(session.id, session)
    return session
  },
  async deleteByToken(token: string) {
    const session = Array.from(sessionsStore.values()).find((s) => s.token === token)
    if (session) {
      sessionsStore.delete(session.id)
    }
  },
}
