import { Injectable } from '@nestjs/common';
import type { NotificationFeatureOptions } from './interfaces';

@Injectable()
export class NotificationConfigRegistry {
  private features: NotificationFeatureOptions[] = [];

  addFeature(feature: NotificationFeatureOptions) {
    this.features.push(feature);
  }

  getFeatures(): NotificationFeatureOptions[] {
    return this.features;
  }
}
