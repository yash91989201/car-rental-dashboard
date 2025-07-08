CREATE TABLE `car-rental-dashboard_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `car-rental-dashboard_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `car-rental-dashboard_account` (`userId`);--> statement-breakpoint
CREATE TABLE `car-rental-dashboard_audit_log` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`adminId` text(255) NOT NULL,
	`listingId` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`adminId`) REFERENCES `car-rental-dashboard_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`listingId`) REFERENCES `car-rental-dashboard_listing`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `car-rental-dashboard_listing` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`carName` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`owner` text(255) NOT NULL,
	`status` text(32) DEFAULT 'pending' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `car-rental-dashboard_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `car-rental-dashboard_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `car-rental-dashboard_session` (`userId`);--> statement-breakpoint
CREATE TABLE `car-rental-dashboard_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`emailVerified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `car-rental-dashboard_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
