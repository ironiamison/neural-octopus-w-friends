import { NextResponse } from 'next/server'

// In-memory storage for demo purposes
const positions = new Map<string, {
  id: string
  walletId: string
  pair: string
  type: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  liquidationPrice: number
  pnl: number
  createdAt: Date
  updatedAt: Date
}>()

const history = new Map<string, {
  id: string
  walletId: string
  pair: string
  type: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  liquidationPrice: number
  pnl: number
  closePrice: number
  createdAt: Date
  updatedAt: Date
  closedAt: Date
}>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletId = searchParams.get('walletId')
  const type = searchParams.get('type')

  if (!walletId) {
    return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
  }

  if (type === 'positions') {
    const userPositions = Array.from(positions.values())
      .filter(p => p.walletId === walletId)
    return NextResponse.json(userPositions)
  } else if (type === 'history') {
    const userHistory = Array.from(history.values())
      .filter(t => t.walletId === walletId)
    return NextResponse.json(userHistory)
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { walletId, action } = body

  if (!walletId) {
    return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
  }

  if (action === 'open') {
    const { pair, type, size, leverage, entryPrice } = body
    const id = Math.random().toString(36).substring(7)
    const now = new Date()

    const position = {
      id,
      walletId,
      pair,
      type,
      size,
      leverage,
      entryPrice,
      liquidationPrice: type === 'long' 
        ? entryPrice * (1 - 1/leverage) 
        : entryPrice * (1 + 1/leverage),
      pnl: 0,
      createdAt: now,
      updatedAt: now
    }

    positions.set(id, position)
    return NextResponse.json(position)
  }

  if (action === 'close') {
    const { positionId, closePrice } = body
    const position = positions.get(positionId)

    if (!position || position.walletId !== walletId) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    const now = new Date()
    const trade = {
      ...position,
      closePrice,
      closedAt: now,
      updatedAt: now,
      pnl: position.type === 'long'
        ? (closePrice - position.entryPrice) / position.entryPrice * position.size * position.leverage
        : (position.entryPrice - closePrice) / position.entryPrice * position.size * position.leverage
    }

    history.set(positionId, trade)
    positions.delete(positionId)
    return NextResponse.json(trade)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
} 