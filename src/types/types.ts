type AppointmentStatus =
    | "available"
    | "reserved"
 
export interface AppointmentsProps {
  id: number
  date: string
  time: string
  status: AppointmentStatus
  doctor_id: number
  user_id: string | null
  created_at: string
}

export interface RegisterUser {
    username: string;
    phone: string;
    email: string;
    password: string;
}

export interface Profile {
    id: string
    username: string
    phone: string
}

export interface DoctorsProps {
  id: number
  name: string
  specialty: string
  created_at: string
}