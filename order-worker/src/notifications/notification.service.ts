import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_OPTIONS } from './constants';
import { NotificationConfigRegistry } from './notification-config.registry';
// ✅ Use 'import type' to clear the "unused" warning
import type {
  NotificationFeatureOptions,
  NotificationModuleOptions,
  NotificationChannel,
} from './interfaces';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_OPTIONS)
    private readonly options: NotificationModuleOptions,
    private readonly registry: NotificationConfigRegistry,
  ) {}

  private getFeature(
    featureName: string,
  ): NotificationFeatureOptions | undefined {
    return this.registry
      .getFeatures()
      .find((f) => f.featureName === featureName);
  }

  // ✅ Uses NotificationChannel, clearing the warning
  private resolveChannels(
    feature?: NotificationFeatureOptions,
  ): NotificationChannel[] {
    if (!this.options.enable) return [];
    if (feature?.channels?.length) return feature.channels;
    return [this.options.defaultChannel];
  }

  notify(featureName: string, event: string, payload: any) {
    if (!this.options.enable) return;

    const feature = this.getFeature(featureName);
    const channels = this.resolveChannels(feature);
    const prefix = feature?.prefix ?? `[${featureName.toUpperCase()}]`;

    for (const ch of channels) {
      console.log(
        `[${ch.toUpperCase()}] ${prefix} (${this.options.appName}) ${event}`,
        payload,
      );
    }
  }
}
