CREATE TABLE `guest_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`place` enum('general','hong-kong','tianjin','usa') NOT NULL DEFAULT 'general',
	`guestNote` varchar(280) NOT NULL,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guest_messages_id` PRIMARY KEY(`id`)
);
