import { CompleteAttractionData, CompleteParkData, CompleteRestaurantData, CompleteShowData, LiveDataStatus, EntityType } from './db';

/* ALERT TYPES */
export type AlertEntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'SHOW' | 'RESTAURANT' | 'SHOP';
export type AlertType = 'WAIT_TIME_THRESHOLD' | 'STATUS_CHANGE_UP' | 'STATUS_CHANGE_DOWN';
export type AlertStatus = 'ACTIVE' | 'PAUSED' | 'TRIGGERED' | 'INACTIVE';

/* ALERT INTERFACE */
export interface Alert {
  id: string;
  userId: string;
  entityId: string;
  entityType: EntityType;
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
  entity?: AlertEntity;
}

export interface CreateAlertRequest {
  userId: string;
  entityId: string;
  entityType: EntityType;
  alertType: AlertType;
  waitTimeThreshold?: number;
  fcmToken: string;
}

export interface UpdateAlertRequest {
  status?: AlertStatus;
  waitTimeThreshold?: number;
  fcmToken?: string;
}

export type AlertEntity = CompleteAttractionData | CompleteShowData | CompleteRestaurantData | CompleteParkData | null;

export type AlertWithEntityData = Alert & {
  entity: AlertEntity;
}
