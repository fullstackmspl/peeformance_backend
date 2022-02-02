ALTER TABLE `peerformance`.`users`
ADD COLUMN `AuthorizationToken` TEXT NULL AFTER `OrganisationID`,
ADD COLUMN `AuthorizationTokenExpiration` TIMESTAMP NULL AFTER `AuthorizationToken`,
ADD COLUMN `AuthorizationEmail` TEXT NOT NULL AFTER `AuthorizationTokenExpiration`;