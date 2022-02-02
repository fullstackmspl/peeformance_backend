alter table `users` add column `peer_group_id` int unsigned  NULL;
alter table `users` add CONSTRAINT `peer_group_id` FOREIGN KEY (`peer_group_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT;
