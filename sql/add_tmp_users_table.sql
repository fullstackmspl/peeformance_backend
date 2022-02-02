create table if not exists `tmp_users` (
	`Id` int unsigned NOT NULL AUTO_INCREMENT,
	`eMail` varchar(45) NOT NULL,
  	`FirstName` varchar(32) DEFAULT NULL,
  	`Surname` varchar(32) DEFAULT NULL,
	`Password` char(60) NOT NULL,
  	`StudyKey` char(32) NOT NULL,
 	`Salt` char(32) NOT NULL,
  	`IV` char(32) NOT NULL,
	`Token` TEXT NOT NULL,
	`Expiration` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,	
    PRIMARY KEY (`Id`),
    UNIQUE KEY `ID_UNIQUE` (`Id`),
    UNIQUE KEY `UsersEmail_UNIQUE` (`eMail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;