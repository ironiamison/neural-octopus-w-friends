import * as THREE from 'three'

export interface Vector {
  x: number
  y: number
  z: number
}

export interface Creature {
  id: string
  position: Vector
  rotation: Vector
  health: number
  energy: number
  age: number
}

export interface Obstacle {
  position: Vector
  size: Vector
  type: 'rock' | 'coral' | 'seaweed'
}

export type SeasonalModifier = {
  temperature: number
  lightLevel: number
  currentStrength: number
}

export interface ConvolutionalNetwork {
  layers: number[]
  weights: Float32Array
  biases: Float32Array
}

export interface GenerativeNetwork {
  encoder: ConvolutionalNetwork
  decoder: ConvolutionalNetwork
}

export interface RecurrentNetwork {
  hiddenStates: Float32Array
  weights: Float32Array
}

export interface ReinforcementNetwork {
  policy: Float32Array
  value: Float32Array
}

export interface AttentionMechanism {
  keys: Float32Array
  queries: Float32Array
  values: Float32Array
}

export interface ExperienceBuffer {
  capacity: number
  experiences: Experience[]
}

export interface EpisodicMemory {
  episodes: Experience[]
  importance: Float32Array
}

export interface Experience {
  state: Float32Array
  action: number
  reward: number
  nextState: Float32Array
}

export interface ColorCell {
  position: Vector
  color: THREE.Color
  size: number
}

export interface RetinaNetwork extends ConvolutionalNetwork {
  receptiveFields: Float32Array[]
}

export type CNN = ConvolutionalNetwork
export type GAN = GenerativeNetwork
export type LSTM = RecurrentNetwork

export interface QuantumState {
  amplitude: Complex
  basis: number[]
}

export interface Complex {
  real: number
  imaginary: number
}

export interface QuantumNetwork {
  qubits: number
  gates: QuantumGate[]
}

export interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT'
  targets: number[]
  controls?: number[]
}

export type Emotion = 'happy' | 'sad' | 'curious' | 'afraid' | 'angry'
export type CreatureId = string
export type BondStrength = number

export interface AdvancedVision {
  process(): Promise<Float32Array>
}

export interface ChemicalDetector {
  analyze(): Promise<Float32Array>
}

export interface PressureMap {
  map(): Promise<Float32Array>
}

export interface ElectricFieldSensor {
  detect(): Promise<Float32Array>
} 