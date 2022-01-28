type INotificationName = `${string}Notification`;
type INotification<T extends INotificationName> = { notificationName: T };

type INotificationHandler<T extends INotification<INotificationName>> = {
  handles: T["notificationName"];

  handle: (notification: T) => Promise<void>;
};

export { INotificationName, INotification, INotificationHandler };
