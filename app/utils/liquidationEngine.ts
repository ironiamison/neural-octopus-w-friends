'use client'

interface Position {
  size: number          // Position size in USD
  leverage: number      // Leverage used (e.g., 10x)
  entryPrice: number    // Entry price of the asset
  type: 'LONG' | 'SHORT'// Position type
  collateral: number    // Amount of collateral in USD
}

interface LiquidationInfo {
  liquidationPrice: number
  maintenanceMargin: number
  initialMargin: number
  effectiveLeverage: number
  liquidationRisk: 'LOW' | 'MEDIUM' | 'HIGH'
}

const MAINTENANCE_MARGIN_RATE = 0.0125  // 1.25% maintenance margin requirement
const INITIAL_MARGIN_RATE = 0.10        // 10% initial margin requirement
const MAX_LEVERAGE = 20                 // Maximum allowed leverage

export function calculateLiquidationPrice(position: Position): LiquidationInfo {
  const { size, leverage, entryPrice, type, collateral } = position
  
  // Validate inputs
  if (leverage > MAX_LEVERAGE) {
    throw new Error(`Leverage cannot exceed ${MAX_LEVERAGE}x`)
  }
  
  if (size <= 0 || entryPrice <= 0 || collateral <= 0) {
    throw new Error('Invalid position parameters')
  }

  // Calculate margins
  const initialMargin = size * INITIAL_MARGIN_RATE
  const maintenanceMargin = size * MAINTENANCE_MARGIN_RATE
  
  // Calculate effective leverage based on position size and collateral
  const effectiveLeverage = size / collateral

  // Calculate liquidation price
  let liquidationPrice: number
  
  if (type === 'LONG') {
    // For longs, liquidation occurs when:
    // (currentPrice - entryPrice) * size/entryPrice + collateral = maintenanceMargin
    liquidationPrice = entryPrice * (1 - (collateral - maintenanceMargin) / size)
  } else {
    // For shorts, liquidation occurs when:
    // (entryPrice - currentPrice) * size/entryPrice + collateral = maintenanceMargin
    liquidationPrice = entryPrice * (1 + (collateral - maintenanceMargin) / size)
  }

  // Calculate liquidation risk
  let liquidationRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  const priceToLiquidationPercent = Math.abs((liquidationPrice - entryPrice) / entryPrice * 100)
  
  if (priceToLiquidationPercent > 15) {
    liquidationRisk = 'LOW'
  } else if (priceToLiquidationPercent > 7) {
    liquidationRisk = 'MEDIUM'
  } else {
    liquidationRisk = 'HIGH'
  }

  return {
    liquidationPrice,
    maintenanceMargin,
    initialMargin,
    effectiveLeverage,
    liquidationRisk
  }
}

// Helper function to validate if a position can be opened
export function canOpenPosition(size: number, leverage: number, collateral: number): boolean {
  if (leverage > MAX_LEVERAGE) return false
  
  const requiredInitialMargin = size * INITIAL_MARGIN_RATE
  return collateral >= requiredInitialMargin
}

// Calculate maximum position size for given collateral
export function getMaxPositionSize(collateral: number, leverage: number): number {
  if (leverage > MAX_LEVERAGE) {
    throw new Error(`Leverage cannot exceed ${MAX_LEVERAGE}x`)
  }
  
  // Max size based on initial margin requirement
  return collateral * leverage
}

// Calculate required collateral for a position
export function getRequiredCollateral(size: number, leverage: number): number {
  return size / leverage
}

// Calculate potential profit/loss
export function calculatePnL(
  position: Position,
  currentPrice: number
): { pnlUSD: number; pnlPercent: number } {
  const { size, entryPrice, type } = position
  
  let pnlUSD: number
  if (type === 'LONG') {
    pnlUSD = size * (currentPrice - entryPrice) / entryPrice
  } else {
    pnlUSD = size * (entryPrice - currentPrice) / entryPrice
  }
  
  const pnlPercent = (pnlUSD / position.collateral) * 100
  
  return { pnlUSD, pnlPercent }
} 