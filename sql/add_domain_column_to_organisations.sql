alter table `organisation`
add column `domain` varchar(45) NOT null,
add constraint `domain_unique` unique (`domain`)