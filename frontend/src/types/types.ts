export interface UserData {
  name: string;
  email: string;
  image?: string;
  [key: string]: any;
}

export interface PaymentCouponData {
  code: string;
  discountValue: number;
  discountType: string;
  description?: string;
  usageLimit?: number;
  usedCount?: number;
  perCustomerLimit?: number;
  validFrom?: string;
  validUntil?: string;
  active?: boolean;
}

export interface TeamData {
  id?: string;
  name: string;
  description: string;
  designation: string;
  email: string;
  image: string | null;
  status: string;
  url1: string;
  url2: string;
}

export interface RoleData {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
  users?: Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventPartnerData {
  event: {
    id: string;
  };
  partner_name: string;
  partner_logo: string;
  partner_description: string;
  partner_phone: string;
  partner_email: string;
  partner_address: string;
  partner_contact_person: string;
  partner_url: string;
}

export interface EventSpeakerData {
  event: {
    id: string;
  };
  speaker_name: string;
  speaker_image: string;
  speaker_desc: string;
  speaker_category: string;
  speaker_speciality: string;
  speaker_qualification: string;
  others1: string;
  others2: string;
}
export interface EventAgendaData {
  event: {
    id: string;
  };
  agenda: string;
  time_period: string;
  agenda_description: string;
}

export interface EventTicketData {
  event: {
    id: string;
  };
  ticket_category: string;
  ticket_description: string;
  ticket_price: number;
  ticket_highlights: string[];
  totalQuota: number;
  maxTicketsPerUser: number;
  salesStartDate: string;
  salesEndDate: string;
}

export interface IndividualEventData {
  event_name: string;
  event_description: string;
  event_date: string;
  event_location: string;
  event_status: string;
  event_logo: string;
  event_description2: string;
  event_start_date: string;
  event_end_date: string;
  event_attendees_count: number;
  has_more_speakers?: boolean;
  is_event_paid?: boolean;
  agenda_subject_to_change?: boolean;
  agendas: {
    id: string;
    agenda: string;
    time_period: string;
    agenda_description: string;
    order?: number;
  }[];
  partners: {
    id: string;
    partner_name: string;
    partner_logo: string;
    partner_description: string;
    partner_phone: string;
    partner_email: string;
    partner_url: string;
    partner_address: string;
    partner_contact_person: string;
  }[];
  speakers: {
    id: string;
    speaker_name: string;
    speaker_image: string;
    speaker_desc: string;
    speaker_category: string;
    speaker_speciality: string;
    speaker_qualification: string;
    others1: string;
    others2: string;
  }[];
  tickets: {
    id: string;
    ticket_category: string;
    ticket_description: string;
    ticket_price: number;
    ticket_highlights: string[];
    formFields: {
      id: string;
      form_question: string;
      input_type: string;
      options: string[];
      is_required: boolean;
      placeholder: string;
      order: number;
    }[];
    totalQuota: number;
    maxTicketsPerUser: number;
    salesStartDate: string | null;
    salesEndDate: string | null;
    currency: string;
  }[];
}

export interface EventsData {
  event_name: string;
  event_description: string;
  event_date: string;
  event_location: string;
  event_status: string;
  event_logo: string;
  event_description2: string;
  event_start_date: string;
  event_end_date: string;
  event_attendees_count: number;
  is_event_paid: boolean;
  id?: string;
  is_active?: boolean;
}

export interface EventPartnerDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  event: EventDataType;
  partner_name: string;
  partner_logo: string;
  partner_description: string;
  partner_phone: string;
  partner_email: string;
  partner_address: string;
  partner_contact_person: string;
  partner_url: string;
}

export interface EventSpeakerDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  event: EventDataType;
  speaker_name: string;
  speaker_image: string;
  speaker_desc: string;
  speaker_category: string;
  speaker_speciality: string;
  speaker_qualification: string;
  others1: string;
  others2: string;
}

export interface EventDataType {
  id: string;
  event_name: string;
  event_logo: string;
  event_description: string;
  event_date: string;
  event_location: string;
  event_description2: string;
  event_status: string;
}

export interface EventAgendaDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  event: EventDataType;
  agenda: string;
  time_period: string;
}

export interface EventTicketFormDataType {
  id: string;
  form_question: string;
  input_type: string;
  options: string[];
  is_required: boolean;
  placeholder: string;
  order: number;
}

export interface EventTicketDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  event: EventDataType;
  ticket_category: string;
  ticket_description: string;
  ticket_price: number;
  ticket_highlights: string[];
  formFields: EventTicketFormDataType[];
  totalQuota: number;
  maxTicketsPerUser: number;
  salesStartDate: string | null;
  salesEndDate: string | null;
  currency: string;
  remainingTicketsCount?: number;
  ticketsSold?: number;
}

export interface MediaData {
  media: string | null;
}

export interface PieChartProps {
  isAnimationActive?: boolean;
  data: any[];
  colors?: string[];
}

export type FieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'editor';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: FieldOption[]; // For select type
}

// ---- Template library / document generation types ----
export type TemplateCategory = "Invoice" | "Letter" | "Report" | "Other";
export type DocumentStatus = "Draft" | "Final" | "Sent";

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "date";
  defaultValue?: string;
}

export interface DocTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  uses: number;
  updatedAt: string;
  fields: TemplateField[];
  content?: string;
  docxFileName?: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  templateId: string;
  status: DocumentStatus;
  date: string;
  values: Record<string, string>;
}

export interface DocFlowRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}