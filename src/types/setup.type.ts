export interface SetupData {
  isComplete: boolean
  setup: {
    channels: boolean
    services: boolean
    professionals: { create: boolean; services: boolean; availability: boolean }
  }
}
