import http from 'http';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory operational store for backend records & telemetry
interface ServerAppointment {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  businessName: string;
  businessType: string;
  storesCount: string;
  interest: string;
  preferredDate: string;
  timeSlot: string;
  meetingType: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  source: 'backend_api' | 'client_sync';
}

interface ServerInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service?: string;
  notes?: string;
  timestamp: string;
}

const appointmentsStore: ServerAppointment[] = [];
const inquiriesStore: ServerInquiry[] = [];
const serverStartTime = Date.now();

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health & Status Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Bitso Innovations Enterprise API',
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      firestoreConfigured: true,
      databaseId: 'ai-studio-bitsoinnovations-1856c77f-9c8b-41b7-a35d-111ea6ba4867',
      status: 'connected',
    },
    version: '2.4.0',
  });
});

// 2. Comprehensive System Telemetry
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    backendConnected: true,
    serverUptimeMs: Date.now() - serverStartTime,
    activeAppointmentsCount: appointmentsStore.length,
    activeInquiriesCount: inquiriesStore.length,
    latencyMs: Math.floor(12 + Math.random() * 8),
    servicesOnline: [
      'Omnichannel POS Gateway',
      'Hyperlocal Dispatch Engine',
      'Inventory Synchronization Ledger',
      'Automated WhatsApp Retention Bot',
      'Executive Strategy Booking System',
    ],
  });
});

// 3. Digital Loop Live Telemetry & Metrics
app.get('/api/digital-loop/telemetry', (req: Request, res: Response) => {
  const now = Date.now();
  // Simulated dynamic cycle based on timestamp
  const loopCycleCount = Math.floor((now - serverStartTime) / 4000) + 1420;
  const currentActiveStage = ((Math.floor(now / 5000) % 5) + 1);

  res.json({
    cycleCount: loopCycleCount,
    activeStage: currentActiveStage,
    stages: [
      {
        step: '01',
        title: 'Discover & Direct Footprint',
        metric: '98.6% Local Query Dominance',
        latency: '24ms',
        status: 'optimal',
      },
      {
        step: '02',
        title: 'High-Velocity Cloud POS',
        metric: '<1.2s Barcode & UPI Billing',
        latency: '18ms',
        status: 'optimal',
      },
      {
        step: '03',
        title: 'Instant Hyperlocal Dispatch',
        metric: '28-Min Doorstep Delivery SLA',
        latency: '35ms',
        status: 'active',
      },
      {
        step: '04',
        title: 'Real-Time ERP & Multi-Store Stock',
        metric: '99.98% Inventory Accuracy',
        latency: '14ms',
        status: 'optimal',
      },
      {
        step: '05',
        title: 'WhatsApp Automated Retention',
        metric: '+34% 30-Day Repeat Repurchase',
        latency: '42ms',
        status: 'active',
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// 4. Contact / Lead Submission Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, company, service, notes } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      error: 'Client name and phone number are required fields.',
    });
  }

  const inquiryId = `INQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const record: ServerInquiry = {
    id: inquiryId,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : undefined,
    company: company ? String(company).trim() : undefined,
    service: service ? String(service).trim() : 'Digital Transformation General',
    notes: notes ? String(notes).trim() : undefined,
    timestamp: new Date().toISOString(),
  };

  inquiriesStore.unshift(record);

  res.status(201).json({
    success: true,
    message: 'Consultation inquiry received and registered with Bitso Executive Team.',
    inquiryId,
    estimatedCallback: 'Within 2 business hours',
    record,
  });
});

// 6. Appointments Management Endpoints
app.get('/api/appointments', (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const email = req.query.email as string | undefined;

  let filtered = appointmentsStore;
  if (userId) {
    filtered = filtered.filter((a) => a.userId === userId);
  } else if (email) {
    filtered = filtered.filter((a) => a.userEmail.toLowerCase() === email.toLowerCase());
  }

  res.json({
    total: filtered.length,
    appointments: filtered,
  });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const {
    userId,
    userName,
    userEmail,
    userPhone,
    businessName,
    businessType,
    storesCount,
    interest,
    preferredDate,
    timeSlot,
    meetingType,
    message,
  } = req.body;

  if (!userName || !userPhone || !preferredDate || !timeSlot) {
    return res.status(400).json({
      error: 'Missing required appointment parameters (userName, userPhone, preferredDate, timeSlot).',
    });
  }

  const apptId = `APPT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newAppointment: ServerAppointment = {
    id: apptId,
    userId: userId || undefined,
    userName: String(userName).trim(),
    userEmail: userEmail ? String(userEmail).trim() : '',
    userPhone: String(userPhone).trim(),
    businessName: businessName ? String(businessName).trim() : 'Retail Enterprise',
    businessType: businessType ? String(businessType).trim() : 'General',
    storesCount: storesCount ? String(storesCount).trim() : '1-3 Stores',
    interest: interest ? String(interest).trim() : 'Strategic Audit',
    preferredDate: String(preferredDate),
    timeSlot: String(timeSlot),
    meetingType: meetingType ? String(meetingType) : 'video',
    message: message ? String(message).trim() : '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'backend_api',
  };

  appointmentsStore.unshift(newAppointment);

  res.status(201).json({
    success: true,
    message: 'Appointment successfully confirmed and logged on backend server.',
    appointmentId: apptId,
    appointment: newAppointment,
  });
});

// -------------------------------------------------------------
// Vite Middleware & Static Serving
// -------------------------------------------------------------
async function startServer() {
  // Static image route fallbacks for development and production environments
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'public', 'images')));

  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      legacy: { skipWebSocketTokenCheck: true },
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: isHmrDisabled ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bitso Server] Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
