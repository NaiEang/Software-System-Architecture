import { DynamicModule, Module, Global } from '@nestjs/common';
import { NOTIFICATION_OPTIONS } from './constants';
import {
  NotificationModuleOptions,
  NotificationFeatureOptions,
} from './interfaces';
import { NotificationsService } from './notification.service';
import { NotificationConfigRegistry } from './notification-config.registry';

@Global()
@Module({}) // Keep this empty!
export class NotificationModule {
  static forRoot(options: NotificationModuleOptions): DynamicModule {
    return {
      module: NotificationModule,
      global: true, // Shared across the whole app
      providers: [
        // 1. Provide the global options
        { provide: NOTIFICATION_OPTIONS, useValue: options },
        // 2. Provide the shared registry
        NotificationConfigRegistry,
        // 3. Provide the service
        NotificationsService,
      ],
      exports: [NotificationsService, NotificationConfigRegistry],
    };
  }

  static forFeature(feature: NotificationFeatureOptions): DynamicModule {
    return {
      module: NotificationModule,
      providers: [
        {
          provide: `CONFIG_${feature.featureName.toUpperCase()}`,
          useFactory: (registry: NotificationConfigRegistry) => {
            registry.addFeature(feature);
            return feature;
          },
          inject: [NotificationConfigRegistry],
        },
      ],
    };
  }
}
