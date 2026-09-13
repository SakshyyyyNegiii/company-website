// Backend API Client for Bitso Innovations Enterprise Services

export interface HealthResponse {
  status: string;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  database: {
    firestoreConfigured: boolean;
    databaseId: string;
    status: string;
  };
  version: string;
}

export interface SystemStatusResponse {
  backendConnected: boolean;
  serverUptimeMs: number;
  activeAppointmentsCount: number;
  activeInquiriesCount: number;
  latencyMs: number;
  servicesOnline: string[];
}

export interface DigitalLoopTelemetryStage {
  step: string;
  title: string;
  metric: string;
  latency: string;
  status: string;
}

export interface DigitalLoopTelemetryResponse {
  cycleCount: number;
  activeStage: number;
  stages: DigitalLoopTelemetryStage[];
  timestamp: string;
}

export interface ContactInquiryPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service?: string;
  notes?: string;
}

export interface AppointmentPayload {
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone: string;
  businessName?: string;
  businessType?: string;
  storesCount?: string;
  interest?: string;
  preferredDate: string;
  timeSlot: string;
  meetingType?: string;
  message?: string;
}

export const api = {
  // Check backend service health
  async checkHealth(): Promise<HealthResponse> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  // Check system diagnostics and connected microservices
  async getSystemStatus(): Promise<SystemStatusResponse> {
    const res = await fetch('/api/system/status');
    if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
    return res.json();
  },

  // Get real-time loop telemetry
  async getDigitalLoopTelemetry(): Promise<DigitalLoopTelemetryResponse> {
    const res = await fetch('/api/digital-loop/telemetry');
    if (!res.ok) throw new Error(`Loop telemetry failed: ${res.statusText}`);
    return res.json();
  },

  // Submit direct lead / enterprise inquiry to backend
  async submitInquiry(payload: ContactInquiryPayload) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Inquiry submission failed with status ${res.status}`);
    }
    return res.json();
  },

  // Book transformation appointment on backend
  async bookAppointment(payload: AppointmentPayload) {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Appointment booking failed with status ${res.status}`);
    }
    return res.json();
  },

  // Query appointments for a user
  async getAppointments(userId?: string, email?: string) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (email) params.append('email', email);
    const res = await fetch(`/api/appointments?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to query appointments: ${res.statusText}`);
    return res.json();
  },
};
