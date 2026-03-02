import { createSlice, type PayloadAction, type AnyAction } from "@reduxjs/toolkit"
import type { Client } from "../components/types"

interface ClientState {
  clients: Client[]
}

const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+34 612 345 678",
    room: "501",
    checkIn: "2025-01-10",
    checkOut: "2025-01-15",
    status: "checked-in",
    vip: true,
    nationality: "España",
    guests: 2,
    totalSpent: 1250,
    notes: "Cliente frecuente, prefiere habitación con vista al mar",
    roomType: "premium",
    visitCount: 5,
    category: "VIP",
    groupMembers: [
      { id: "1a", name: "Laura Mendoza", email: "laura.m@email.com", phone: "+34 612 345 679", relationship: "Esposa" },
    ],
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+34 698 765 432",
    room: "302",
    checkIn: "2025-01-12",
    checkOut: "2025-01-14",
    status: "checked-in",
    vip: false,
    nationality: "México",
    guests: 1,
    totalSpent: 450,
    notes: "",
    roomType: "standard",
    visitCount: 1,
    category: "Basic",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555 123 4567",
    room: "204",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    status: "reserved",
    vip: true,
    nationality: "USA",
    guests: 3,
    totalSpent: 2800,
    notes: "Requiere servicio concierge",
    roomType: "premium",
    visitCount: 8,
    category: "Elite",
  },
  {
    id: "4",
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+33 612 345 678",
    room: "405",
    checkIn: "2025-01-16",
    checkOut: "2025-01-18",
    status: "checked-in",
    vip: false,
    nationality: "Francia",
    guests: 1,
    totalSpent: 680,
    notes: "Prefiere comidas vegetarianas",
    roomType: "deluxe",
    visitCount: 3,
    category: "Preferred",
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+966 50 123 4567",
    room: "301",
    checkIn: "2025-01-11",
    checkOut: "2025-01-16",
    status: "checked-in",
    vip: true,
    nationality: "Arabia Saudita",
    guests: 4,
    totalSpent: 3500,
    notes: "Cliente VIP - Primer viaje",
    roomType: "premium",
    visitCount: 1,
    category: "VIP",
  },
  {
    id: "6",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+44 20 7946 0958",
    room: "103",
    checkIn: "2025-01-13",
    checkOut: "2025-01-17",
    status: "checked-in",
    vip: false,
    nationality: "Reino Unido",
    guests: 2,
    totalSpent: 550,
    notes: "",
    roomType: "standard",
    visitCount: 2,
    category: "Basic",
  },
  {
    id: "7",
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+55 11 98765-4321",
    room: "502",
    checkIn: "2025-01-09",
    checkOut: "2025-01-14",
    status: "checked-out",
    vip: false,
    nationality: "Brasil",
    guests: 1,
    totalSpent: 920,
    notes: "Solicitó early checkout",
    roomType: "deluxe",
    visitCount: 4,
    category: "Elite",
  },
]

const initialState: ClientState = {
  clients: [],
}

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload
    },
  },
})

export const { setClients } = clientSlice.actions

export function loadMockClients() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setClients(MOCK_CLIENTS))
  }
}

export { MOCK_CLIENTS }
export default clientSlice.reducer
