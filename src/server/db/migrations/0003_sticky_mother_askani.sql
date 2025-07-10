PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_car-rental-dashboard_audit_log` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`action` text(255) NOT NULL,
	`adminId` text(255) NOT NULL,
	`listingId` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`adminId`) REFERENCES `car-rental-dashboard_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`listingId`) REFERENCES `car-rental-dashboard_listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_car-rental-dashboard_audit_log`("id", "action", "adminId", "listingId", "createdAt") SELECT "id", "action", "adminId", "listingId", "createdAt" FROM `car-rental-dashboard_audit_log`;--> statement-breakpoint
DROP TABLE `car-rental-dashboard_audit_log`;--> statement-breakpoint
ALTER TABLE `__new_car-rental-dashboard_audit_log` RENAME TO `car-rental-dashboard_audit_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;