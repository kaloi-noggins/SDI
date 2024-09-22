export interface Vehicle {
    licensePlate: string
    vehicleCategory: "A" | "B" | "C" | "D" | "E"
    operator: "OPERADOR_1" | "OPERADOR_2" | "OPERADOR_3" | "NAO_INDENTIFICADO"
}

export interface OperatorPrices {
  A: number
  B: number
  C: number
  D: number
  E: number
}

export interface OperatorStats{
    totalVehicleCount: number
    totalToll: number
    A:{vehiclesCount: number, tollCount : number}
    B:{vehiclesCount: number, tollCount : number}
    C:{vehiclesCount: number, tollCount : number}
    D:{vehiclesCount: number, tollCount : number}
    E:{vehiclesCount: number, tollCount : number}
}