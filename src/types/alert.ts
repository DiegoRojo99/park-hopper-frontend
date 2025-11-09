import { LiveDataStatus } from './db';

/* ALERT TYPES */
export type AlertEntityType = 'ATTRACTION' | 'SHOW' | 'RESTAURANT' | 'PARK';
export type AlertType = 'WAIT_TIME_THRESHOLD' | 'STATUS_CHANGE_UP' | 'STATUS_CHANGE_DOWN';
export type AlertStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';

export interface Alert {
  id: string;
  userId: string;
  entityId: string;
  entityType: AlertEntityType;
  alertType: AlertType;
  status: AlertStatus;
  waitTimeThreshold: number | null;
  lastKnownStatus: LiveDataStatus | null;
  fcmToken: string | null;
  webhookUrl: string | null;
  notificationCount: number;
  lastTriggered: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRequest {
  userId: string;
  entityId: string;
  entityType: AlertEntityType;
  alertType: AlertType;
  waitTimeThreshold?: number;
  fcmToken: string;
}

export interface UpdateAlertRequest {
  status?: AlertStatus;
  waitTimeThreshold?: number;
  fcmToken?: string;
}
