import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuditLog {
  id: string
  userId: string
  action: string
  category: 'TRADE' | 'AUTH' | 'PORTFOLIO' | 'SYSTEM'
  details: any
  status: 'SUCCESS' | 'FAILURE'
  errorMessage?: string
  ipAddress?: string
  timestamp: Date
}

export class AuditService {
  static async log(params: Omit<AuditLog, 'id' | 'timestamp'>) {
    try {
      await prisma.auditLog.create({
        data: {
          ...params,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Error creating audit log:', error)
      // Still try to log to console if DB fails
      console.warn('Audit Log:', {
        ...params,
        timestamp: new Date(),
        error
      })
    }
  }

  static async getLogsForUser(userId: string, category?: string) {
    return prisma.auditLog.findMany({
      where: {
        userId,
        ...(category ? { category } : {})
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
  }
} 