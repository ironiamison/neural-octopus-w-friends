'use client'

import { DEFAULT_TRADING_CONFIG, LEVERAGE_TIERS } from '../lib/constants/trading'

interface Position {
  size: number          // Position size in USD
  leverage: number      // Leverage used (e.g., 100x)
  entryPrice: number    // Entry price of the asset
  type: 'LONG' | 'SHORT'// Position type
  collateral: number    // Initial margin in USD
}

interface LiquidationInfo {
  liquidationPrice: number
  maintenanceMargin: number
  initialMargin: number
  effectiveLeverage: number
  liquidationRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  maxPnL: number
  maxLoss: number
}

// Calculate liquidation price for isolated margin
export function calculateLiquidationPrice(position: Position): LiquidationInfo {
  const { size, leverage, entryPrice, type, collateral } = position
  
  // Validate inputs
  const maxLeverageAllowed = LEVERAGE_TIERS[LEVERAGE_TIERS.length - 1].maxLeverage
  if (leverage > maxLeverageAllowed) {
    throw new Error(`Leverage cannot exceed ${maxLeverageAllowed}x`)
  }
  
  if (size <= 0 || entryPrice <= 0 || collateral <= 0) {
    throw new Error('Invalid position parameters')
  }

  // Calculate margins for isolated positions
  const initialMargin = size / leverage // This is the collateral
  const maintenanceMargin = size * DEFAULT_TRADING_CONFIG.maintenanceMargin
  
  // Calculate effective leverage based on position size and collateral
  const effectiveLeverage = size / collateral

  // For isolated margin, liquidation occurs when unrealized PnL + collateral = maintenanceMargin
  let liquidationPrice: number
  
  if (type === 'LONG') {
    // For longs: (currentPrice - entryPrice) * size/entryPrice + collateral = maintenanceMargin
    liquidationPrice = entryPrice * (1 - (collateral - maintenanceMargin) / size)
  } else {
    // For shorts: (entryPrice - currentPrice) * size/entryPrice + collateral = maintenanceMargin
    liquidationPrice = entryPrice * (1 + (collateral - maintenanceMargin) / size)
  }

  // Calculate max PnL and loss
  const maxPnL = size * (DEFAULT_TRADING_CONFIG.maxDrawdown - 1) // Maximum profit potential
  const maxLoss = collateral * DEFAULT_TRADING_CONFIG.maxDrawdown // Maximum loss is capped at collateral

  // Calculate liquidation risk based on effective leverage
  let liquidationRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  if (effectiveLeverage <= 20) {
    liquidationRisk = 'LOW'
  } else if (effectiveLeverage <= 50) {
    liquidationRisk = 'MEDIUM'
  } else {
    liquidationRisk = 'HIGH'
  }

  return {
    liquidationPrice,
    maintenanceMargin,
    initialMargin,
    effectiveLeverage,
    liquidationRisk,
    maxPnL,
    maxLoss
  }
}

// Helper function to validate if a position can be opened with isolated margin
export function canOpenPosition(size: number, leverage: number, collateral: number): boolean {
  if (leverage > LEVERAGE_TIERS[LEVERAGE_TIERS.length - 1].maxLeverage) return false
  
  const requiredMargin = size / leverage
  return collateral >= requiredMargin
}

// Calculate maximum position size for given collateral with isolated margin
export function getMaxPositionSize(collateral: number, leverage: number): number {
  if (leverage > LEVERAGE_TIERS[LEVERAGE_TIERS.length - 1].maxLeverage) {
    throw new Error(`Leverage cannot exceed ${LEVERAGE_TIERS[LEVERAGE_TIERS.length - 1].maxLeverage}x`)
  }
  
  // For isolated margin, max size is collateral * leverage
  return collateral * leverage
}

// Calculate required collateral for an isolated margin position
export function getRequiredCollateral(size: number, leverage: number): number {
  return size / leverage
}

// Calculate potential profit/loss for isolated margin
export function calculatePnL(
  position: Position,
  currentPrice: number
): { pnlUSD: number; pnlPercent: number; roiPercent: number } {
  const { size, entryPrice, type, collateral } = position
  
  let pnlUSD: number
  if (type === 'LONG') {
    pnlUSD = size * (currentPrice - entryPrice) / entryPrice
  } else {
    pnlUSD = size * (entryPrice - currentPrice) / entryPrice
  }
  
  const pnlPercent = (pnlUSD / size) * 100
  const roiPercent = (pnlUSD / collateral) * 100
  
  return { pnlUSD, pnlPercent, roiPercent }
} 