import { createSlice, type PayloadAction, type AnyAction } from "@reduxjs/toolkit"
import { createApi } from "@reduxjs/toolkit/query/react"
import { ENDPOINTS } from "@/shared/types/api"
import { baseQueryWithOrg } from "@/store/baseQuery"
import type { Client } from "../components/types"

export interface ClientApiDto {
  id: string
  organizationId: string
  firstName?: string
  lastName?: string
  name: string
  email: string
  phone?: string | null
  nationality?: string | null
  category: string
  notes?: string | null
  userId?: string | null
  createdAt?: string
  updatedAt?: string
  user?: { id: string; firstName: string; lastName: string; email: string }
  reservations?: Array<{ id: string; roomId: string; checkIn: string; checkOut: string; status: string }>
}

export interface GetClientsResponse {
  objects: ClientApiDto[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

function toDateString(value: string | undefined): string {
  if (!value) return "-"
  return value.includes("T") ? value.split("T")[0]! : value
}

function mapReservationStatusToClientStatus(apiStatus: string): Client["status"] {
  switch (apiStatus) {
    case "checked_in":
      return "checked-in"
    case "checked_out":
    case "cancelled":
      return "checked-out"
    case "pending":
    case "confirmed":
    default:
      return "reserved"
  }
}

export function mapClientApiToClient(d: ClientApiDto): Client {
  const hasReservations = d.reservations != null && d.reservations.length > 0
  const firstReservation = d.reservations?.[0]
  const name =
    d.name ?? (d.firstName != null || d.lastName != null ? [d.firstName, d.lastName].filter(Boolean).join(" ") : "")

  if (!hasReservations) {
    return {
      id: d.id,
      name: name || "-",
      email: d.email,
      phone: d.phone ?? "-",
      room: "-",
      checkIn: "-",
      checkOut: "-",
      status: "no-reservation",
      vip: d.category === "VIP",
      nationality: d.nationality ?? "-",
      guests: "-",
      totalSpent: "-",
      notes: d.notes ?? undefined,
      category: (d.category as Client["category"]) ?? "Basic",
    }
  }

  return {
    id: d.id,
    name: name || "-",
    email: d.email,
    phone: d.phone ?? "-",
    room: "-",
    checkIn: toDateString(firstReservation?.checkIn) || "-",
    checkOut: toDateString(firstReservation?.checkOut) || "-",
    status: mapReservationStatusToClientStatus(firstReservation?.status ?? "pending"),
    vip: d.category === "VIP",
    nationality: d.nationality ?? "-",
    guests: "-",
    totalSpent: "-",
    notes: d.notes ?? undefined,
    category: (d.category as Client["category"]) ?? "Basic",
  }
}

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

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: baseQueryWithOrg,
  tagTypes: ["Clients"],
  endpoints: (build) => ({
    getClients: build.query<
      { data: GetClientsResponse },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: ENDPOINTS.CLIENT,
        method: "GET",
        params: params ?? { page: 1, limit: 100 },
        credentials: "include",
      }),
      providesTags: ["Clients"],
    }),
    getClientById: build.query<{ data: ClientApiDto }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.CLIENT}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_, __, id) => [{ type: "Clients", id }],
    }),
    createClient: build.mutation<
      { data: ClientApiDto },
      {
        firstName: string
        lastName: string
        email: string
        phone?: string | null
        nationality?: string | null
        category: string
        notes?: string | null
        createUserForClient?: boolean
      }
    >({
      query: (body) => ({
        url: ENDPOINTS.CLIENT,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Clients"],
    }),
    updateClient: build.mutation<
      { data: ClientApiDto },
      { id: string; payload: Partial<ClientApiDto> }
    >({
      query: ({ id, payload }) => ({
        url: `${ENDPOINTS.CLIENT}/${id}`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: (_, __, arg) =>
        arg?.id ? [{ type: "Clients", id: arg.id }, "Clients"] : ["Clients"],
    }),
    deleteClient: build.mutation<{ data: { success: boolean } }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.CLIENT}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
})

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi

export const { setClients } = clientSlice.actions

export function loadMockClients() {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch(setClients(MOCK_CLIENTS))
  }
}

export { MOCK_CLIENTS }
export default clientSlice.reducer
