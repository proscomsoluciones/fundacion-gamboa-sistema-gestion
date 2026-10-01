-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: sistema_fund_gamboa
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beneficiarios`
--

DROP TABLE IF EXISTS `beneficiarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `beneficiarios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `rut` varchar(255) DEFAULT NULL,
  `comuna` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `sucursal_registro_id` bigint(20) unsigned NOT NULL DEFAULT 1,
  `fecha_registro` date DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `contacto_adicional` varchar(255) DEFAULT NULL,
  `parentesco` varchar(255) DEFAULT NULL,
  `representante_nombre` varchar(255) DEFAULT NULL,
  `representante_rut` varchar(255) DEFAULT NULL,
  `representante_telefono` varchar(255) DEFAULT NULL,
  `representante_direccion` varchar(255) DEFAULT NULL,
  `representante_comuna` varchar(255) DEFAULT NULL,
  `representante_sector` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `cedula_path` varchar(255) DEFAULT NULL,
  `cedula_original_name` varchar(255) DEFAULT NULL,
  `documento_adicional_path` varchar(255) DEFAULT NULL,
  `documento_adicional_original_name` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `beneficiarios_sucursal_registro_id_foreign` (`sucursal_registro_id`),
  CONSTRAINT `beneficiarios_sucursal_registro_id_foreign` FOREIGN KEY (`sucursal_registro_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiarios`
--

LOCK TABLES `beneficiarios` WRITE;
/*!40000 ALTER TABLE `beneficiarios` DISABLE KEYS */;
INSERT INTO `beneficiarios` VALUES (1,'María Teresa Soto Morales','12.345.678-9','Maipú',NULL,1,'2026-06-02','Av. Los Olivos 432, Sector Poniente','+56 9 8765 4321','Carlos Soto Morales','Hijo/a','Carlos Eduardo González','16.543.210-K','+56 9 8765 4321',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'activo','2026-09-03 03:35:57','2026-09-15 00:37:05'),(2,'Pedro Antonio Gómez Silva','15.678.901-2','Santiago Centro',NULL,1,'2026-07-02','Calle El Manzano 12, Sector Centro','+56 9 7654 3210','Luisa Gómez Rojas','Cónyuge',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'activo','2026-09-03 03:35:57','2026-09-03 03:35:57'),(3,'Ana Luisa Fernández Riquelme','9.876.543-1','Providencia',NULL,1,'2026-08-02','Pasaje Las Rosas 88, Sector Norte','+56 9 6543 2109','Elena Fernández','Cuidadora Principal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'activo','2026-09-03 03:35:57','2026-09-03 03:35:57'),(4,'Fernando José Pérez Pérez','10.123.450-7','Catemu','Catemu Centro',2,'2026-04-27','Calle Principal N° 255, Catemu Centro','+56 9 58058559','+56 9 75098898','Hermano/a','Roberto Alejandro Pérez Araya','10.123.451-8','+56 9 52092850','Calle Principal N° 279, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:57:33','2026-09-16 02:57:33'),(5,'Luis Alberto Tapia Rojas','10.123.450-7','Catemu','Catemu Centro',2,'2026-05-01','Calle Principal N° 224, Catemu Centro','+56 9 70722558','+56 9 55028124','Cuidador/a Responsable','Luis Alberto Tapia Contreras','10.123.451-8','+56 9 56331609','Calle Principal N° 303, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:57:55','2026-09-16 02:57:55'),(6,'Mario Esteban Pérez Vergara','10.124.371-1','Catemu','Catemu Centro',2,'2026-07-01','Calle Principal N° 366, Catemu Centro','+56 9 58659496','+56 9 96354951','Beneficiario Directo (El mismo paciente retira)','Roberto Alejandro Pérez Gallardo','10.124.372-2','+56 9 99007550','Calle Principal N° 217, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:19','2026-09-16 02:58:19'),(7,'Francisco Javier Campos Bustos','10.124.138-2','Catemu','Catemu Centro',2,'2026-07-02','Calle Principal N° 345, Catemu Centro','+56 9 73293095','+56 9 88976695','Beneficiario Directo (El mismo paciente retira)','Héctor Manuel Campos Contreras','10.124.139-3','+56 9 64814731','Calle Principal N° 20, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(8,'Marta Alicia Rojas Campos','10.124.140-4','Catemu','Catemu Centro',2,'2026-08-18','Calle Principal N° 443, Catemu Centro','+56 9 81140119','+56 9 62467990','Cónyuge / Esposo(a)','Ricardo Andrés Rojas Fuentes','10.124.141-5','+56 9 93656480','Calle Principal N° 443, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(9,'José Luis Fuentes Tapia','10.124.142-6','Catemu','Catemu Centro',2,'2026-09-02','Calle Principal N° 428, Catemu Centro','+56 9 83433471','+56 9 52397901','Cuidador/a Responsable','Patricia Elizabeth Fuentes Tapia','10.124.143-7','+56 9 96806134','Calle Principal N° 70, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(10,'Verónica Isabel Soto Morales','10.124.144-8','Catemu','Catemu Centro',2,'2026-06-25','Calle Principal N° 201, Catemu Centro','+56 9 61419279','+56 9 96887217','Cónyuge / Esposo(a)','Francisco Javier Soto Salinas','10.124.145-0','+56 9 52774921','Calle Principal N° 344, Catemu Centro','Catemu','Catemu Centro','Paciente residente en sector Catemu Centro de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(11,'Francisco Javier Bustos Vergara','10.124.146-1','Catemu','El Arrayán',1,'2026-07-15','Calle Principal N° 104, El Arrayán','+56 9 57954848','+56 9 62096447','Madre / Padre','Pedro Antonio Bustos Espinoza','10.124.147-2','+56 9 61271900','Calle Principal N° 291, El Arrayán','Catemu','El Arrayán','Paciente residente en sector El Arrayán de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(12,'Patricia Elizabeth Morales Contreras','10.124.148-3','Catemu','El Arrayán',1,'2026-04-30','Calle Principal N° 30, El Arrayán','+56 9 62441550','+56 9 57071790','Cónyuge / Esposo(a)','Juan Carlos Morales Bustos','10.124.149-4','+56 9 86528532','Calle Principal N° 180, El Arrayán','Catemu','El Arrayán','Paciente residente en sector El Arrayán de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(13,'Mario Esteban Carrasco Espinoza','10.124.150-5','Catemu','El Arrayán',1,'2026-03-19','Calle Principal N° 192, El Arrayán','+56 9 80203041','+56 9 63663990','Beneficiario Directo (El mismo paciente retira)','María Elena Carrasco Carrasco','10.124.151-6','+56 9 62315165','Calle Principal N° 377, El Arrayán','Catemu','El Arrayán','Paciente residente en sector El Arrayán de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(14,'Lucía Fernanda Campos Fuentes','10.124.152-7','Catemu','El Arrayán',1,'2026-08-06','Calle Principal N° 171, El Arrayán','+56 9 95058774','+56 9 97664329','Cuidador/a Responsable','Mario Esteban Campos Olivares','10.124.153-8','+56 9 66037979','Calle Principal N° 408, El Arrayán','Catemu','El Arrayán','Paciente residente en sector El Arrayán de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(15,'José Luis Espinoza Bravo','10.124.154-K','Catemu','Chagres',7,'2026-08-23','Calle Principal N° 74, Chagres','+56 9 69332886','+56 9 71110899','Madre / Padre','José Luis Espinoza Bravo','10.124.155-1','+56 9 63546810','Calle Principal N° 103, Chagres','Catemu','Chagres','Paciente residente en sector Chagres de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(16,'Rosa Amelia Pérez Campos','10.124.156-2','Catemu','Chagres',7,'2026-03-24','Calle Principal N° 66, Chagres','+56 9 71931718','+56 9 95116088','Hijo/a','Mario Esteban Pérez Morales','10.124.157-3','+56 9 63458858','Calle Principal N° 91, Chagres','Catemu','Chagres','Paciente residente en sector Chagres de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(17,'Mario Esteban Carrasco Morales','10.124.158-4','Catemu','Chagres',7,'2026-05-02','Calle Principal N° 226, Chagres','+56 9 86621945','+56 9 89784460','Cuidador/a Responsable','Carmen Gloria Carrasco Muñoz','10.124.159-5','+56 9 79701642','Calle Principal N° 324, Chagres','Catemu','Chagres','Paciente residente en sector Chagres de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(18,'Ana Luisa Tapia Campos','10.124.160-6','Catemu','Chagres',7,'2026-04-10','Calle Principal N° 196, Chagres','+56 9 85520078','+56 9 51162632','Madre / Padre','José Luis Tapia Soto','10.124.161-7','+56 9 75561627','Calle Principal N° 365, Chagres','Catemu','Chagres','Paciente residente en sector Chagres de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(19,'Héctor Manuel Bustos Tapia','10.124.162-8','Catemu','Colonia El Cobre',1,'2026-05-30','Calle Principal N° 403, Colonia El Cobre','+56 9 79147907','+56 9 52863144','Hermano/a','Ricardo Andrés Bustos Carrasco','10.124.163-0','+56 9 60562936','Calle Principal N° 438, Colonia El Cobre','Catemu','Colonia El Cobre','Paciente residente en sector Colonia El Cobre de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(20,'María Elena Pérez Araya','10.124.164-1','Catemu','Colonia El Cobre',1,'2026-07-10','Calle Principal N° 405, Colonia El Cobre','+56 9 69351041','+56 9 94799318','Beneficiario Directo (El mismo paciente retira)','Mario Esteban Pérez Vergara','10.124.165-2','+56 9 87004304','Calle Principal N° 344, Colonia El Cobre','Catemu','Colonia El Cobre','Paciente residente en sector Colonia El Cobre de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(21,'Roberto Alejandro Rojas Gallardo','10.124.166-3','Catemu','Colonia El Cobre',1,'2026-04-02','Calle Principal N° 108, Colonia El Cobre','+56 9 71823027','+56 9 89460364','Cuidador/a Responsable','Olga Patricia Rojas Vergara','10.124.167-4','+56 9 96727651','Calle Principal N° 32, Colonia El Cobre','Catemu','Colonia El Cobre','Paciente residente en sector Colonia El Cobre de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(22,'Margarita Rosa Tapia Silva','10.124.168-5','Catemu','Colonia El Cobre',1,'2026-09-05','Calle Principal N° 67, Colonia El Cobre','+56 9 88347313','+56 9 90274817','Cuidador/a Responsable','Fernando José Tapia Gallardo','10.124.169-6','+56 9 71034550','Calle Principal N° 102, Colonia El Cobre','Catemu','Colonia El Cobre','Paciente residente en sector Colonia El Cobre de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(23,'Roberto Alejandro Gallardo Tapia','10.124.170-7','Catemu','Seco Alto',2,'2026-05-18','Calle Principal N° 194, Seco Alto','+56 9 55648637','+56 9 86800788','Cónyuge / Esposo(a)','Ricardo Andrés Gallardo Olivares','10.124.171-8','+56 9 76691746','Calle Principal N° 261, Seco Alto','Catemu','Seco Alto','Paciente residente en sector Seco Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(24,'Marta Alicia González Vergara','10.124.172-K','Catemu','Seco Alto',2,'2026-09-03','Calle Principal N° 235, Seco Alto','+56 9 60235918','+56 9 92165955','Cónyuge / Esposo(a)','Roberto Alejandro González Fuentes','10.124.173-1','+56 9 73025005','Calle Principal N° 16, Seco Alto','Catemu','Seco Alto','Paciente residente en sector Seco Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(25,'Luis Alberto Salinas Campos','10.124.174-2','Catemu','Seco Alto',2,'2026-05-12','Calle Principal N° 48, Seco Alto','+56 9 62376894','+56 9 72763101','Cuidador/a Responsable','María Elena Salinas Gallardo','10.124.175-3','+56 9 73215037','Calle Principal N° 393, Seco Alto','Catemu','Seco Alto','Paciente residente en sector Seco Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(26,'Silvia Eugenia Silva Gallardo','10.124.176-4','Catemu','Seco Alto',2,'2026-07-07','Calle Principal N° 362, Seco Alto','+56 9 89588041','+56 9 79105649','Hijo/a','José Luis Silva Carrasco','10.124.177-5','+56 9 95707854','Calle Principal N° 358, Seco Alto','Catemu','Seco Alto','Paciente residente en sector Seco Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(27,'Mario Esteban Fuentes Salinas','10.124.178-6','Catemu','Seco Bajo',1,'2026-05-28','Calle Principal N° 186, Seco Bajo','+56 9 70209837','+56 9 94911781','Hijo/a','Roberto Alejandro Fuentes Pérez','10.124.179-7','+56 9 82405451','Calle Principal N° 237, Seco Bajo','Catemu','Seco Bajo','Paciente residente en sector Seco Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(28,'Verónica Isabel Tapia Tapia','10.124.180-8','Catemu','Seco Bajo',1,'2026-05-14','Calle Principal N° 359, Seco Bajo','+56 9 79475756','+56 9 81047570','Hijo/a','Pedro Antonio Tapia Fuentes','10.124.181-0','+56 9 83875086','Calle Principal N° 321, Seco Bajo','Catemu','Seco Bajo','Paciente residente en sector Seco Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(29,'Francisco Javier Tapia Gallardo','10.124.182-1','Catemu','Seco Bajo',1,'2026-05-15','Calle Principal N° 430, Seco Bajo','+56 9 82188767','+56 9 95865160','Madre / Padre','Carmen Gloria Tapia Olivares','10.124.183-2','+56 9 53201761','Calle Principal N° 442, Seco Bajo','Catemu','Seco Bajo','Paciente residente en sector Seco Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(30,'Silvia Eugenia Vergara Contreras','10.124.184-3','Catemu','Seco Bajo',1,'2026-05-25','Calle Principal N° 194, Seco Bajo','+56 9 71863774','+56 9 55319271','Tutor Legal / Curador','Juan Carlos Vergara Salinas','10.124.185-4','+56 9 92986186','Calle Principal N° 395, Seco Bajo','Catemu','Seco Bajo','Paciente residente en sector Seco Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(31,'Francisco Javier Silva Gallardo','10.124.186-5','Catemu','La Cuadra',1,'2026-05-22','Calle Principal N° 223, La Cuadra','+56 9 76387015','+56 9 79661928','Tutor Legal / Curador','Héctor Manuel Silva Soto','10.124.187-6','+56 9 70321379','Calle Principal N° 347, La Cuadra','Catemu','La Cuadra','Paciente residente en sector La Cuadra de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(32,'Ana Luisa Contreras Gallardo','10.124.188-7','Catemu','La Cuadra',1,'2026-03-30','Calle Principal N° 326, La Cuadra','+56 9 67470039','+56 9 54709607','Cuidador/a Responsable','Luis Alberto Contreras Campos','10.124.189-8','+56 9 94111604','Calle Principal N° 406, La Cuadra','Catemu','La Cuadra','Paciente residente en sector La Cuadra de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(33,'Fernando José Espinoza Araya','10.124.190-K','Catemu','La Cuadra',1,'2026-05-19','Calle Principal N° 394, La Cuadra','+56 9 70016703','+56 9 93734647','Beneficiario Directo (El mismo paciente retira)','Ana Luisa Espinoza Soto','10.124.191-1','+56 9 51424402','Calle Principal N° 23, La Cuadra','Catemu','La Cuadra','Paciente residente en sector La Cuadra de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(34,'Teresa del Carmen Silva Morales','10.124.192-2','Catemu','La Cuadra',1,'2026-05-16','Calle Principal N° 274, La Cuadra','+56 9 89638757','+56 9 99711733','Beneficiario Directo (El mismo paciente retira)','Mario Esteban Silva Pérez','10.124.193-3','+56 9 82244483','Calle Principal N° 52, La Cuadra','Catemu','La Cuadra','Paciente residente en sector La Cuadra de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(35,'Héctor Manuel Espinoza Gallardo','10.124.194-4','Catemu','Las Varillas',1,'2026-08-25','Calle Principal N° 179, Las Varillas','+56 9 79542204','+56 9 73825651','Madre / Padre','Luis Alberto Espinoza Bravo','10.124.195-5','+56 9 99980256','Calle Principal N° 14, Las Varillas','Catemu','Las Varillas','Paciente residente en sector Las Varillas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(36,'Silvia Eugenia Morales Pérez','10.124.196-6','Catemu','Las Varillas',1,'2026-09-09','Calle Principal N° 363, Las Varillas','+56 9 55175132','+56 9 90161188','Madre / Padre','Francisco Javier Morales González','10.124.197-7','+56 9 68426939','Calle Principal N° 101, Las Varillas','Catemu','Las Varillas','Paciente residente en sector Las Varillas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(37,'Carlos Eduardo Olivares Bustos','10.124.198-8','Catemu','Las Varillas',1,'2026-04-12','Calle Principal N° 256, Las Varillas','+56 9 95782476','+56 9 90119516','Cuidador/a Responsable','María Elena Olivares Bustos','10.124.199-0','+56 9 67511896','Calle Principal N° 41, Las Varillas','Catemu','Las Varillas','Paciente residente en sector Las Varillas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(38,'María Elena Contreras Muñoz','10.124.200-1','Catemu','Las Varillas',1,'2026-07-20','Calle Principal N° 145, Las Varillas','+56 9 50457584','+56 9 95568750','Hijo/a','Fernando José Contreras Olivares','10.124.201-2','+56 9 68032093','Calle Principal N° 371, Las Varillas','Catemu','Las Varillas','Paciente residente en sector Las Varillas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(39,'Juan Carlos Tapia Carrasco','10.124.202-3','Catemu','Compuertas',2,'2026-09-06','Calle Principal N° 74, Compuertas','+56 9 84943309','+56 9 73344809','Hijo/a','José Luis Tapia Campos','10.124.203-4','+56 9 66344820','Calle Principal N° 222, Compuertas','Catemu','Compuertas','Paciente residente en sector Compuertas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(40,'Carmen Gloria Rojas Pérez','10.124.204-5','Catemu','Compuertas',2,'2026-03-25','Calle Principal N° 385, Compuertas','+56 9 51943599','+56 9 74307106','Madre / Padre','Héctor Manuel Rojas Campos','10.124.205-6','+56 9 58261860','Calle Principal N° 74, Compuertas','Catemu','Compuertas','Paciente residente en sector Compuertas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(41,'Pedro Antonio Fuentes Muñoz','10.124.206-7','Catemu','Compuertas',2,'2026-08-20','Calle Principal N° 30, Compuertas','+56 9 83503648','+56 9 99438440','Tutor Legal / Curador','Carmen Gloria Fuentes Silva','10.124.207-8','+56 9 96458621','Calle Principal N° 360, Compuertas','Catemu','Compuertas','Paciente residente en sector Compuertas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(42,'Margarita Rosa Bustos Salinas','10.124.208-K','Catemu','Compuertas',2,'2026-05-08','Calle Principal N° 440, Compuertas','+56 9 64300966','+56 9 66748862','Madre / Padre','Héctor Manuel Bustos Araya','10.124.209-1','+56 9 97725974','Calle Principal N° 130, Compuertas','Catemu','Compuertas','Paciente residente en sector Compuertas de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(43,'Luis Alberto Campos Rojas','10.124.210-2','Catemu','Ñilhue',1,'2026-06-05','Calle Principal N° 446, Ñilhue','+56 9 59177451','+56 9 92488298','Tutor Legal / Curador','Héctor Manuel Campos Campos','10.124.211-3','+56 9 98549916','Calle Principal N° 220, Ñilhue','Catemu','Ñilhue','Paciente residente en sector Ñilhue de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(44,'Ana Luisa Olivares Bravo','10.124.212-4','Catemu','Ñilhue',1,'2026-04-19','Calle Principal N° 137, Ñilhue','+56 9 71326503','+56 9 76410907','Cónyuge / Esposo(a)','Héctor Manuel Olivares Carrasco','10.124.213-5','+56 9 50218302','Calle Principal N° 67, Ñilhue','Catemu','Ñilhue','Paciente residente en sector Ñilhue de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(45,'Mario Esteban Salinas Espinoza','10.124.214-6','Catemu','Ñilhue',1,'2026-08-22','Calle Principal N° 429, Ñilhue','+56 9 98624903','+56 9 71806563','Beneficiario Directo (El mismo paciente retira)','Lucía Fernanda Salinas Salinas','10.124.215-7','+56 9 72779620','Calle Principal N° 282, Ñilhue','Catemu','Ñilhue','Paciente residente en sector Ñilhue de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(46,'Lucía Fernanda Olivares Contreras','10.124.216-8','Catemu','Ñilhue',1,'2026-07-27','Calle Principal N° 165, Ñilhue','+56 9 94585575','+56 9 53878497','Hermano/a','Mario Esteban Olivares Rojas','10.124.217-0','+56 9 55448589','Calle Principal N° 430, Ñilhue','Catemu','Ñilhue','Paciente residente en sector Ñilhue de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(47,'Roberto Alejandro Carrasco González','10.124.218-1','Catemu','La Poza',1,'2026-05-01','Calle Principal N° 257, La Poza','+56 9 84118821','+56 9 94166488','Tutor Legal / Curador','Carlos Eduardo Carrasco González','10.124.219-2','+56 9 68319913','Calle Principal N° 402, La Poza','Catemu','La Poza','Paciente residente en sector La Poza de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(48,'Lucía Fernanda Bravo Fuentes','10.124.220-3','Catemu','La Poza',1,'2026-07-17','Calle Principal N° 281, La Poza','+56 9 88374854','+56 9 57485720','Tutor Legal / Curador','Luis Alberto Bravo Vergara','10.124.221-4','+56 9 96514531','Calle Principal N° 271, La Poza','Catemu','La Poza','Paciente residente en sector La Poza de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(49,'Roberto Alejandro Araya Fuentes','10.124.222-5','Catemu','La Poza',1,'2026-04-08','Calle Principal N° 15, La Poza','+56 9 58703092','+56 9 71791129','Cuidador/a Responsable','Teresa del Carmen Araya Campos','10.124.223-6','+56 9 99097917','Calle Principal N° 312, La Poza','Catemu','La Poza','Paciente residente en sector La Poza de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(50,'Olga Patricia Bravo Muñoz','10.124.224-7','Catemu','La Poza',1,'2026-03-30','Calle Principal N° 297, La Poza','+56 9 96448779','+56 9 81106460','Cuidador/a Responsable','Pedro Antonio Bravo Bustos','10.124.225-8','+56 9 58087146','Calle Principal N° 76, La Poza','Catemu','La Poza','Paciente residente en sector La Poza de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(51,'Juan Carlos Pérez Vergara','10.124.226-K','Catemu','Las Marías',1,'2026-06-12','Calle Principal N° 251, Las Marías','+56 9 61219861','+56 9 58508839','Cónyuge / Esposo(a)','Roberto Alejandro Pérez Pérez','10.124.227-1','+56 9 79635066','Calle Principal N° 374, Las Marías','Catemu','Las Marías','Paciente residente en sector Las Marías de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(52,'Patricia Elizabeth Soto Gallardo','10.124.228-2','Catemu','Las Marías',1,'2026-07-07','Calle Principal N° 411, Las Marías','+56 9 78113526','+56 9 50929333','Hijo/a','José Luis Soto Muñoz','10.124.229-3','+56 9 78277767','Calle Principal N° 233, Las Marías','Catemu','Las Marías','Paciente residente en sector Las Marías de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(53,'Mario Esteban Pérez Vergara','10.124.230-4','Catemu','Las Marías',1,'2026-07-07','Calle Principal N° 122, Las Marías','+56 9 68733639','+56 9 60963641','Cónyuge / Esposo(a)','Olga Patricia Pérez Carrasco','10.124.231-5','+56 9 63690294','Calle Principal N° 36, Las Marías','Catemu','Las Marías','Paciente residente en sector Las Marías de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(54,'Silvia Eugenia Tapia Vergara','10.124.232-6','Catemu','Las Marías',1,'2026-03-27','Calle Principal N° 53, Las Marías','+56 9 81527418','+56 9 91395714','Cuidador/a Responsable','Héctor Manuel Tapia Espinoza','10.124.233-7','+56 9 93608962','Calle Principal N° 168, Las Marías','Catemu','Las Marías','Paciente residente en sector Las Marías de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(55,'Carlos Eduardo Tapia Carrasco','10.124.234-8','Catemu','Cerrillos',3,'2026-06-21','Calle Principal N° 137, Cerrillos','+56 9 67859016','+56 9 92895546','Hijo/a','Fernando José Tapia Carrasco','10.124.235-0','+56 9 64305884','Calle Principal N° 247, Cerrillos','Catemu','Cerrillos','Paciente residente en sector Cerrillos de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(56,'Carmen Gloria Espinoza Contreras','10.124.236-1','Catemu','Cerrillos',3,'2026-05-19','Calle Principal N° 412, Cerrillos','+56 9 92101902','+56 9 85746355','Hijo/a','Pedro Antonio Espinoza Contreras','10.124.237-2','+56 9 52336090','Calle Principal N° 132, Cerrillos','Catemu','Cerrillos','Paciente residente en sector Cerrillos de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(57,'Pedro Antonio Tapia González','10.124.238-3','Catemu','Cerrillos',3,'2026-03-25','Calle Principal N° 69, Cerrillos','+56 9 78464125','+56 9 63661513','Cuidador/a Responsable','Olga Patricia Tapia Morales','10.124.239-4','+56 9 97769246','Calle Principal N° 416, Cerrillos','Catemu','Cerrillos','Paciente residente en sector Cerrillos de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(58,'Rosa Amelia Tapia Rojas','10.124.240-5','Catemu','Cerrillos',3,'2026-04-22','Calle Principal N° 324, Cerrillos','+56 9 68115934','+56 9 54569386','Madre / Padre','Guillermo Enrique Tapia González','10.124.241-6','+56 9 54730334','Calle Principal N° 402, Cerrillos','Catemu','Cerrillos','Paciente residente en sector Cerrillos de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(59,'Héctor Manuel Tapia Soto','10.124.242-7','Catemu','San Carlos Alto',1,'2026-03-21','Calle Principal N° 198, San Carlos Alto','+56 9 70776873','+56 9 70286338','Cuidador/a Responsable','Francisco Javier Tapia Araya','10.124.243-8','+56 9 83224984','Calle Principal N° 312, San Carlos Alto','Catemu','San Carlos Alto','Paciente residente en sector San Carlos Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(60,'Ana Luisa Espinoza González','10.124.244-K','Catemu','San Carlos Alto',1,'2026-07-10','Calle Principal N° 111, San Carlos Alto','+56 9 69828800','+56 9 70285599','Cuidador/a Responsable','Ricardo Andrés Espinoza Salinas','10.124.245-1','+56 9 91574165','Calle Principal N° 302, San Carlos Alto','Catemu','San Carlos Alto','Paciente residente en sector San Carlos Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(61,'Mario Esteban Muñoz Tapia','10.124.246-2','Catemu','San Carlos Alto',1,'2026-05-08','Calle Principal N° 175, San Carlos Alto','+56 9 85595287','+56 9 90459301','Madre / Padre','Verónica Isabel Muñoz Contreras','10.124.247-3','+56 9 72505013','Calle Principal N° 294, San Carlos Alto','Catemu','San Carlos Alto','Paciente residente en sector San Carlos Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(62,'Lucía Fernanda Rojas Bravo','10.124.248-4','Catemu','San Carlos Alto',1,'2026-06-28','Calle Principal N° 113, San Carlos Alto','+56 9 76985648','+56 9 96435743','Cuidador/a Responsable','Juan Carlos Rojas Salinas','10.124.249-5','+56 9 89824250','Calle Principal N° 183, San Carlos Alto','Catemu','San Carlos Alto','Paciente residente en sector San Carlos Alto de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(63,'Pedro Antonio Fuentes Contreras','10.124.250-6','Catemu','San Carlos Bajo',1,'2026-06-11','Calle Principal N° 394, San Carlos Bajo','+56 9 63477234','+56 9 92061423','Madre / Padre','Roberto Alejandro Fuentes Pérez','10.124.251-7','+56 9 58741832','Calle Principal N° 403, San Carlos Bajo','Catemu','San Carlos Bajo','Paciente residente en sector San Carlos Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(64,'Teresa del Carmen Muñoz Araya','10.124.252-8','Catemu','San Carlos Bajo',1,'2026-05-26','Calle Principal N° 95, San Carlos Bajo','+56 9 71856095','+56 9 54849357','Beneficiario Directo (El mismo paciente retira)','Fernando José Muñoz Bravo','10.124.253-0','+56 9 81183261','Calle Principal N° 287, San Carlos Bajo','Catemu','San Carlos Bajo','Paciente residente en sector San Carlos Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(65,'José Luis Carrasco Salinas','10.124.254-1','Catemu','San Carlos Bajo',1,'2026-08-13','Calle Principal N° 173, San Carlos Bajo','+56 9 92496731','+56 9 93002376','Hermano/a','Olga Patricia Carrasco Campos','10.124.255-2','+56 9 99162643','Calle Principal N° 286, San Carlos Bajo','Catemu','San Carlos Bajo','Paciente residente en sector San Carlos Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(66,'Rosa Amelia Morales Fuentes','10.124.256-3','Catemu','San Carlos Bajo',1,'2026-07-05','Calle Principal N° 46, San Carlos Bajo','+56 9 65020978','+56 9 99817752','Beneficiario Directo (El mismo paciente retira)','Fernando José Morales Rojas','10.124.257-4','+56 9 97478967','Calle Principal N° 44, San Carlos Bajo','Catemu','San Carlos Bajo','Paciente residente en sector San Carlos Bajo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(67,'Ricardo Andrés Rojas Morales','10.124.258-5','Catemu','Santa Margarita',1,'2026-04-19','Calle Principal N° 265, Santa Margarita','+56 9 85652240','+56 9 51735678','Hijo/a','Roberto Alejandro Rojas Morales','10.124.259-6','+56 9 58046273','Calle Principal N° 430, Santa Margarita','Catemu','Santa Margarita','Paciente residente en sector Santa Margarita de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(68,'Verónica Isabel Morales Silva','10.124.260-7','Catemu','Santa Margarita',1,'2026-08-06','Calle Principal N° 209, Santa Margarita','+56 9 96883020','+56 9 95676387','Madre / Padre','Héctor Manuel Morales Morales','10.124.261-8','+56 9 93784725','Calle Principal N° 34, Santa Margarita','Catemu','Santa Margarita','Paciente residente en sector Santa Margarita de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(69,'Héctor Manuel Morales Campos','10.124.262-K','Catemu','Santa Margarita',1,'2026-04-04','Calle Principal N° 83, Santa Margarita','+56 9 63288568','+56 9 76915069','Hermano/a','Silvia Eugenia Morales Muñoz','10.124.263-1','+56 9 80610901','Calle Principal N° 418, Santa Margarita','Catemu','Santa Margarita','Paciente residente en sector Santa Margarita de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(70,'Ana Luisa Bustos Olivares','10.124.264-2','Catemu','Santa Margarita',1,'2026-08-24','Calle Principal N° 46, Santa Margarita','+56 9 79854699','+56 9 86075304','Beneficiario Directo (El mismo paciente retira)','Juan Carlos Bustos Tapia','10.124.265-3','+56 9 61365878','Calle Principal N° 248, Santa Margarita','Catemu','Santa Margarita','Paciente residente en sector Santa Margarita de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(71,'Carlos Eduardo Vergara Salinas','10.124.266-4','Catemu','San José',2,'2026-08-03','Calle Principal N° 11, San José','+56 9 63674172','+56 9 92785521','Hermano/a','Carlos Eduardo Vergara Bravo','10.124.267-5','+56 9 98881702','Calle Principal N° 151, San José','Catemu','San José','Paciente residente en sector San José de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(72,'Ana Luisa Rojas Tapia','10.124.268-6','Catemu','San José',2,'2026-06-17','Calle Principal N° 180, San José','+56 9 54731786','+56 9 82539884','Madre / Padre','Ricardo Andrés Rojas Pérez','10.124.269-7','+56 9 84788847','Calle Principal N° 413, San José','Catemu','San José','Paciente residente en sector San José de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(73,'Francisco Javier Contreras Rojas','10.124.270-8','Catemu','San José',2,'2026-04-02','Calle Principal N° 404, San José','+56 9 76173068','+56 9 93544129','Madre / Padre','Marta Alicia Contreras Carrasco','10.124.271-0','+56 9 82447180','Calle Principal N° 109, San José','Catemu','San José','Paciente residente en sector San José de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(74,'Olga Patricia Fuentes Espinoza','10.124.272-1','Catemu','San José',2,'2026-08-22','Calle Principal N° 227, San José','+56 9 71991740','+56 9 65466286','Madre / Padre','Ricardo Andrés Fuentes Fuentes','10.124.273-2','+56 9 96028978','Calle Principal N° 104, San José','Catemu','San José','Paciente residente en sector San José de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(75,'Roberto Alejandro Carrasco Fuentes','10.124.274-3','Catemu','Reinoso',1,'2026-08-07','Calle Principal N° 417, Reinoso','+56 9 69626606','+56 9 52878995','Hermano/a','Guillermo Enrique Carrasco Vergara','10.124.275-4','+56 9 74697183','Calle Principal N° 55, Reinoso','Catemu','Reinoso','Paciente residente en sector Reinoso de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(76,'Teresa del Carmen Rojas Fuentes','10.124.276-5','Catemu','Reinoso',1,'2026-09-05','Calle Principal N° 431, Reinoso','+56 9 96305714','+56 9 50975027','Tutor Legal / Curador','Carlos Eduardo Rojas Soto','10.124.277-6','+56 9 73090504','Calle Principal N° 87, Reinoso','Catemu','Reinoso','Paciente residente en sector Reinoso de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(77,'Carlos Eduardo Campos Tapia','10.124.278-7','Catemu','Reinoso',1,'2026-05-11','Calle Principal N° 430, Reinoso','+56 9 58518522','+56 9 99041582','Beneficiario Directo (El mismo paciente retira)','Marta Alicia Campos Espinoza','10.124.279-8','+56 9 89071562','Calle Principal N° 346, Reinoso','Catemu','Reinoso','Paciente residente en sector Reinoso de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(78,'Lucía Fernanda Campos Salinas','10.124.280-K','Catemu','Reinoso',1,'2026-08-05','Calle Principal N° 262, Reinoso','+56 9 92456188','+56 9 59857796','Hermano/a','José Luis Campos Salinas','10.124.281-1','+56 9 78481374','Calle Principal N° 410, Reinoso','Catemu','Reinoso','Paciente residente en sector Reinoso de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(79,'Roberto Alejandro Morales Soto','10.124.282-2','Catemu','Santa Isabel',4,'2026-08-02','Calle Principal N° 166, Santa Isabel','+56 9 89766498','+56 9 83571267','Cónyuge / Esposo(a)','Francisco Javier Morales Olivares','10.124.283-3','+56 9 88786083','Calle Principal N° 162, Santa Isabel','Catemu','Santa Isabel','Paciente residente en sector Santa Isabel de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(80,'Margarita Rosa Espinoza Olivares','10.124.284-4','Catemu','Santa Isabel',4,'2026-05-23','Calle Principal N° 269, Santa Isabel','+56 9 68607648','+56 9 78367090','Hijo/a','Mario Esteban Espinoza Campos','10.124.285-5','+56 9 85764769','Calle Principal N° 64, Santa Isabel','Catemu','Santa Isabel','Paciente residente en sector Santa Isabel de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(81,'Francisco Javier Rojas Contreras','10.124.286-6','Catemu','Santa Isabel',4,'2026-09-06','Calle Principal N° 190, Santa Isabel','+56 9 99394492','+56 9 69611363','Hijo/a','Patricia Elizabeth Rojas Fuentes','10.124.287-7','+56 9 55545248','Calle Principal N° 120, Santa Isabel','Catemu','Santa Isabel','Paciente residente en sector Santa Isabel de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(82,'Ana Luisa Rojas Contreras','10.124.288-8','Catemu','Santa Isabel',4,'2026-08-04','Calle Principal N° 342, Santa Isabel','+56 9 67565413','+56 9 78907956','Tutor Legal / Curador','Héctor Manuel Rojas Olivares','10.124.289-0','+56 9 66117037','Calle Principal N° 114, Santa Isabel','Catemu','Santa Isabel','Paciente residente en sector Santa Isabel de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(83,'Guillermo Enrique Bustos Muñoz','10.124.290-1','Catemu','El Carmelo',1,'2026-07-06','Calle Principal N° 108, El Carmelo','+56 9 63473418','+56 9 92588530','Cónyuge / Esposo(a)','Pedro Antonio Bustos Bravo','10.124.291-2','+56 9 71070322','Calle Principal N° 187, El Carmelo','Catemu','El Carmelo','Paciente residente en sector El Carmelo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(84,'Rosa Amelia Contreras Bustos','10.124.292-3','Catemu','El Carmelo',1,'2026-07-01','Calle Principal N° 225, El Carmelo','+56 9 97469853','+56 9 54440283','Cuidador/a Responsable','Guillermo Enrique Contreras Fuentes','10.124.293-4','+56 9 90980153','Calle Principal N° 410, El Carmelo','Catemu','El Carmelo','Paciente residente en sector El Carmelo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(85,'Carlos Eduardo Pérez Contreras','10.124.294-5','Catemu','El Carmelo',1,'2026-09-07','Calle Principal N° 428, El Carmelo','+56 9 73394452','+56 9 76915258','Madre / Padre','Margarita Rosa Pérez Rojas','10.124.295-6','+56 9 82120225','Calle Principal N° 38, El Carmelo','Catemu','El Carmelo','Paciente residente en sector El Carmelo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(86,'Carmen Gloria Soto Morales','10.124.296-7','Catemu','El Carmelo',1,'2026-06-08','Calle Principal N° 205, El Carmelo','+56 9 63650899','+56 9 69734037','Beneficiario Directo (El mismo paciente retira)','Francisco Javier Soto Muñoz','10.124.297-8','+56 9 66351909','Calle Principal N° 287, El Carmelo','Catemu','El Carmelo','Paciente residente en sector El Carmelo de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(87,'Roberto Alejandro Silva Araya','10.124.298-K','Catemu','Los Corrales',6,'2026-07-31','Calle Principal N° 200, Los Corrales','+56 9 57210832','+56 9 66050169','Hermano/a','Juan Carlos Silva Soto','10.124.299-1','+56 9 68311941','Calle Principal N° 158, Los Corrales','Catemu','Los Corrales','Paciente residente en sector Los Corrales de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(88,'Patricia Elizabeth Campos Silva','10.124.300-2','Catemu','Los Corrales',6,'2026-05-27','Calle Principal N° 229, Los Corrales','+56 9 94946402','+56 9 87184441','Madre / Padre','José Luis Campos Gallardo','10.124.301-3','+56 9 65336039','Calle Principal N° 109, Los Corrales','Catemu','Los Corrales','Paciente residente en sector Los Corrales de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(89,'Fernando José Araya Muñoz','10.124.302-4','Catemu','Los Corrales',6,'2026-07-31','Calle Principal N° 198, Los Corrales','+56 9 81801407','+56 9 69463062','Hermano/a','Marta Alicia Araya Bravo','10.124.303-5','+56 9 94452714','Calle Principal N° 104, Los Corrales','Catemu','Los Corrales','Paciente residente en sector Los Corrales de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(90,'Marta Alicia Fuentes Bustos','10.124.304-6','Catemu','Los Corrales',6,'2026-06-01','Calle Principal N° 14, Los Corrales','+56 9 85074867','+56 9 69312655','Hermano/a','Carlos Eduardo Fuentes Fuentes','10.124.305-7','+56 9 77678920','Calle Principal N° 361, Los Corrales','Catemu','Los Corrales','Paciente residente en sector Los Corrales de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(91,'Fernando José Rojas Olivares','10.124.306-8','Catemu','Santa Rosa',1,'2026-05-20','Calle Principal N° 166, Santa Rosa','+56 9 98431167','+56 9 56331282','Beneficiario Directo (El mismo paciente retira)','Héctor Manuel Rojas Muñoz','10.124.307-0','+56 9 99412591','Calle Principal N° 312, Santa Rosa','Catemu','Santa Rosa','Paciente residente en sector Santa Rosa de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(92,'Silvia Eugenia Rojas González','10.124.308-1','Catemu','Santa Rosa',1,'2026-04-05','Calle Principal N° 424, Santa Rosa','+56 9 82467763','+56 9 77670273','Cónyuge / Esposo(a)','Francisco Javier Rojas Espinoza','10.124.309-2','+56 9 61851914','Calle Principal N° 249, Santa Rosa','Catemu','Santa Rosa','Paciente residente en sector Santa Rosa de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(93,'Mario Esteban Rojas Gallardo','10.124.310-3','Catemu','Santa Rosa',1,'2026-04-12','Calle Principal N° 377, Santa Rosa','+56 9 51056567','+56 9 87281690','Tutor Legal / Curador','María Elena Rojas Morales','10.124.311-4','+56 9 89629709','Calle Principal N° 194, Santa Rosa','Catemu','Santa Rosa','Paciente residente en sector Santa Rosa de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(94,'Ana Luisa Bravo Olivares','10.124.312-5','Catemu','Santa Rosa',1,'2026-03-22','Calle Principal N° 15, Santa Rosa','+56 9 60301248','+56 9 57461215','Hijo/a','Carlos Eduardo Bravo Bustos','10.124.313-6','+56 9 62059581','Calle Principal N° 409, Santa Rosa','Catemu','Santa Rosa','Paciente residente en sector Santa Rosa de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(95,'Guillermo Enrique Pérez Gallardo','10.124.314-7','Catemu','Quebrachal',5,'2026-04-07','Calle Principal N° 440, Quebrachal','+56 9 84661822','+56 9 76816207','Madre / Padre','Héctor Manuel Pérez Araya','10.124.315-8','+56 9 64533707','Calle Principal N° 297, Quebrachal','Catemu','Quebrachal','Paciente residente en sector Quebrachal de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(96,'Ana Luisa Campos Olivares','10.124.316-K','Catemu','Quebrachal',5,'2026-08-28','Calle Principal N° 143, Quebrachal','+56 9 70541570','+56 9 71129088','Hijo/a','José Luis Campos Morales','10.124.317-1','+56 9 70975394','Calle Principal N° 172, Quebrachal','Catemu','Quebrachal','Paciente residente en sector Quebrachal de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(97,'Pedro Antonio Muñoz González','10.124.318-2','Catemu','Quebrachal',5,'2026-05-18','Calle Principal N° 64, Quebrachal','+56 9 75300422','+56 9 87337359','Tutor Legal / Curador','Margarita Rosa Muñoz Espinoza','10.124.319-3','+56 9 93022314','Calle Principal N° 154, Quebrachal','Catemu','Quebrachal','Paciente residente en sector Quebrachal de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(98,'Marta Alicia Vergara Tapia','10.124.320-4','Catemu','Quebrachal',5,'2026-07-31','Calle Principal N° 74, Quebrachal','+56 9 62304094','+56 9 72126908','Hermano/a','Roberto Alejandro Vergara Vergara','10.124.321-5','+56 9 91103036','Calle Principal N° 220, Quebrachal','Catemu','Quebrachal','Paciente residente en sector Quebrachal de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 03:03:00'),(99,'José Luis Rojas Bravo','10.124.322-6','Catemu','La Redonda',1,'2026-08-31','Calle Principal N° 435, La Redonda','+56 9 75840084','+56 9 81621469','Hijo/a','Luis Alberto Rojas Bustos','10.124.323-7','+56 9 83584671','Calle Principal N° 122, La Redonda','Catemu','La Redonda','Paciente residente en sector La Redonda de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(100,'Olga Patricia Pérez Tapia','10.124.324-8','Catemu','La Redonda',1,'2026-04-01','Calle Principal N° 26, La Redonda','+56 9 83166301','+56 9 75555281','Hijo/a','Luis Alberto Pérez Bustos','10.124.325-0','+56 9 50796285','Calle Principal N° 400, La Redonda','Catemu','La Redonda','Paciente residente en sector La Redonda de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(101,'Héctor Manuel Vergara Muñoz','10.124.326-1','Catemu','La Redonda',1,'2026-08-13','Calle Principal N° 261, La Redonda','+56 9 52009178','+56 9 52406403','Madre / Padre','Carmen Gloria Vergara Rojas','10.124.327-2','+56 9 51044809','Calle Principal N° 42, La Redonda','Catemu','La Redonda','Paciente residente en sector La Redonda de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53'),(102,'Olga Patricia Gallardo Silva','10.124.328-3','Catemu','La Redonda',1,'2026-04-14','Calle Principal N° 156, La Redonda','+56 9 62114501','+56 9 86089837','Hijo/a','Héctor Manuel Gallardo Muñoz','10.124.329-4','+56 9 62075051','Calle Principal N° 438, La Redonda','Catemu','La Redonda','Paciente residente en sector La Redonda de Catemu. Registro completo.',NULL,NULL,NULL,NULL,'activo','2026-09-16 02:58:53','2026-09-16 02:58:53');
/*!40000 ALTER TABLE `beneficiarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorias_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Camas y Catres','Camas clínicas eléctricas, manuales y accesorios articulados.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(2,'Sillas de Ruedas','Sillas de ruedas de transporte, ergonómicas y plegables.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(3,'Colchones','Colchones clínicos y sistemas de aire antiescaras con compresor.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(4,'Andadores','Andadores de paso, burritos de aluminio regulables.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(5,'Sillas de Baño / W.C.','Sillas para ducha y sanitarios portátiles adaptados.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(6,'Grúas de Traslado','Grúas hidráulicas y eléctricas para movilidad de pacientes.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(7,'Bastones y Muletas','Bastones de 1 y 4 apoyos, muletas axilares y canadienses.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(8,'Insumos Kinésicos','Cojines ortopédicos, pesas y elementos de rehabilitación.','2026-09-03 03:35:57','2026-09-03 03:35:57'),(9,'Insumos Desechables y Pañales','Pañales de adulto, sabanillas de cama y compresas de higiene personal.','2026-09-04 01:59:26','2026-09-04 01:59:26'),(10,'Protección y Sanitarios','Guantes de nitrilo/látex, mascarillas, pecheras y elementos de aseo.','2026-09-04 01:59:26','2026-09-04 01:59:26'),(11,'Nutrición y Cuidados Clínicos','Apósitos de curación, suplementos alimenticios y sueros.','2026-09-04 01:59:26','2026-09-04 01:59:26');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_finanzas`
--

DROP TABLE IF EXISTS `categorias_finanzas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias_finanzas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('ingreso','egreso','ambos') NOT NULL DEFAULT 'ambos',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorias_finanzas_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_finanzas`
--

LOCK TABLES `categorias_finanzas` WRITE;
/*!40000 ALTER TABLE `categorias_finanzas` DISABLE KEYS */;
INSERT INTO `categorias_finanzas` VALUES (1,'Subvención Municipal / Estatal','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(2,'Donaciones y Aportes de Colaboradores','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(3,'Eventos y Actividades de Recaudación','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(4,'Aportes de Benefactores Particulares','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(5,'Convenios e Instituciones','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(6,'Otros Ingresos Operativos','ingreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(7,'Adquisición de Equipos Clínicos','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(8,'Insumos Kinésicos y Sanitarios','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(9,'Mantención y Reparación de Ayudas Técnicas','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(10,'Gastos Operativos y Logística','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(11,'Combustible y Fletes de Entrega','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(12,'Servicios Básicos y Operación','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54'),(13,'Viáticos y Traslados de Personal','egreso','2026-09-15 01:36:54','2026-09-15 01:36:54');
/*!40000 ALTER TABLE `categorias_finanzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comodato_items`
--

DROP TABLE IF EXISTS `comodato_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comodato_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comodato_id` bigint(20) unsigned NOT NULL,
  `producto_id` bigint(20) unsigned NOT NULL,
  `unidad_producto_id` bigint(20) unsigned DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comodato_items_comodato_id_foreign` (`comodato_id`),
  KEY `comodato_items_producto_id_foreign` (`producto_id`),
  KEY `comodato_items_unidad_producto_id_foreign` (`unidad_producto_id`),
  CONSTRAINT `comodato_items_comodato_id_foreign` FOREIGN KEY (`comodato_id`) REFERENCES `comodatos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comodato_items_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos_inventario` (`id`),
  CONSTRAINT `comodato_items_unidad_producto_id_foreign` FOREIGN KEY (`unidad_producto_id`) REFERENCES `unidades_producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comodato_items`
--

LOCK TABLES `comodato_items` WRITE;
/*!40000 ALTER TABLE `comodato_items` DISABLE KEYS */;
INSERT INTO `comodato_items` VALUES (1,1,1,1,1,'2026-09-03 22:41:27','2026-09-03 22:41:27'),(2,2,8,NULL,2,'2026-09-04 02:02:25','2026-09-04 02:02:25'),(3,3,1,2,1,'2026-09-13 00:17:45','2026-09-13 00:17:45'),(4,3,2,8,1,'2026-09-13 00:17:45','2026-09-13 00:17:45'),(5,4,10,NULL,1,'2026-09-15 04:10:26','2026-09-15 04:10:26'),(6,7,2,5,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(7,8,12,34,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(8,9,13,41,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(9,10,10,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(10,11,10,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(11,12,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(12,13,8,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(13,14,4,9,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(14,15,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(15,16,12,35,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(16,17,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(17,18,1,11,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(18,19,4,10,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(19,20,8,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(20,21,12,36,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(21,22,10,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(22,23,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(23,24,2,6,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(24,25,6,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(25,26,11,31,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(26,27,11,32,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(27,28,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(28,29,4,37,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(29,30,5,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(30,31,12,36,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(31,32,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(32,33,5,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(33,34,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(34,35,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(35,36,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(36,37,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(37,38,11,32,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(38,39,1,11,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(39,40,12,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(40,41,4,38,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(41,42,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(42,43,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(43,44,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(44,45,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(45,46,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(46,47,2,6,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(47,48,8,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(48,49,1,11,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(49,50,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(50,51,6,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(51,52,11,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(52,53,8,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(53,54,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(54,55,2,7,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(55,56,5,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(56,57,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(57,58,6,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(58,59,12,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(59,60,12,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(60,61,13,42,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(61,62,12,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(62,63,5,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(63,64,2,26,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(64,65,1,12,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(65,66,11,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(66,67,3,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(67,68,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(68,69,9,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(69,70,11,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(70,71,2,27,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(71,72,6,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(72,73,13,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(73,74,7,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(74,75,12,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(75,76,1,13,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(76,77,5,NULL,1,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(77,78,2,28,1,'2026-09-16 02:58:53','2026-09-16 02:58:53');
/*!40000 ALTER TABLE `comodato_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comodatos`
--

DROP TABLE IF EXISTS `comodatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comodatos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `beneficiario_id` bigint(20) unsigned NOT NULL,
  `responsable_entrega_id` bigint(20) unsigned NOT NULL,
  `sucursal_id` bigint(20) unsigned NOT NULL DEFAULT 1,
  `fecha_entrega` date NOT NULL,
  `fecha_estimada_devolucion` date DEFAULT NULL,
  `fecha_devolucion_real` date DEFAULT NULL,
  `estado` enum('activo','devuelto','en_seguimiento','perdido') NOT NULL DEFAULT 'activo',
  `observaciones_entrega` text DEFAULT NULL,
  `observaciones_devolucion` text DEFAULT NULL,
  `documento_pdf_path` varchar(255) DEFAULT NULL,
  `documento_firmado_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comodatos_codigo_unique` (`codigo`),
  KEY `comodatos_beneficiario_id_foreign` (`beneficiario_id`),
  KEY `comodatos_responsable_entrega_id_foreign` (`responsable_entrega_id`),
  KEY `comodatos_sucursal_id_foreign` (`sucursal_id`),
  CONSTRAINT `comodatos_beneficiario_id_foreign` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`),
  CONSTRAINT `comodatos_responsable_entrega_id_foreign` FOREIGN KEY (`responsable_entrega_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comodatos_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comodatos`
--

LOCK TABLES `comodatos` WRITE;
/*!40000 ALTER TABLE `comodatos` DISABLE KEYS */;
INSERT INTO `comodatos` VALUES (1,'COM-2026-0001',3,1,1,'2026-09-03',NULL,'2026-09-16','devuelto',NULL,NULL,'comodatos/pdf/COM-2026-0001.pdf',NULL,'2026-09-03 22:41:27','2026-09-16 18:25:46'),(2,'COM-2026-0002',3,1,1,'2026-09-03',NULL,NULL,'activo',NULL,NULL,'comodatos/pdf/COM-2026-0002.pdf',NULL,'2026-09-04 02:02:25','2026-09-04 02:02:25'),(3,'COM-2026-0003',2,1,1,'2026-09-12',NULL,NULL,'activo',NULL,NULL,'comodatos/pdf/COM-2026-0003.pdf',NULL,'2026-09-13 00:17:45','2026-09-13 00:17:45'),(4,'COM-2026-0004',3,1,1,'2026-09-15',NULL,'2026-09-15','devuelto',NULL,NULL,'comodatos/pdf/COM-2026-0004.pdf',NULL,'2026-09-15 04:10:26','2026-09-15 04:25:52'),(6,'COM-2026-0015',6,1,2,'2026-07-06','2027-01-06',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:19','2026-09-16 02:58:19'),(7,'COM-2026-0017',7,1,2,'2026-07-03','2027-01-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(8,'COM-2026-0018',8,1,2,'2026-08-22','2027-02-22',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(9,'COM-2026-0019',9,1,2,'2026-09-03','2027-03-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(10,'COM-2026-0021',11,1,1,'2026-07-17','2027-01-17',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(11,'COM-2026-0022',12,1,1,'2026-05-01','2026-11-01',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(12,'COM-2026-0023',13,1,1,'2026-03-24','2026-09-24','2026-04-08','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(13,'COM-2026-0025',15,1,7,'2026-08-26','2027-02-26',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(14,'COM-2026-0026',16,1,7,'2026-03-28','2026-09-28',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(15,'COM-2026-0027',17,1,7,'2026-05-06','2026-11-06','2026-05-23','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(16,'COM-2026-0029',19,1,1,'2026-06-03','2026-12-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(17,'COM-2026-0030',20,1,1,'2026-07-13','2027-01-13',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(18,'COM-2026-0031',21,1,1,'2026-04-05','2026-10-05','2026-05-02','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(19,'COM-2026-0033',23,1,2,'2026-05-23','2026-11-23',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(20,'COM-2026-0034',24,1,2,'2026-09-08','2027-03-08',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(21,'COM-2026-0035',25,1,2,'2026-05-16','2026-11-16','2026-06-01','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(22,'COM-2026-0037',27,1,1,'2026-06-01','2026-12-01',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(23,'COM-2026-0038',28,1,1,'2026-05-16','2026-11-16',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(24,'COM-2026-0039',29,1,1,'2026-05-20','2026-11-20','2026-06-17','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(25,'COM-2026-0041',31,1,1,'2026-05-24','2026-11-24',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(26,'COM-2026-0042',32,1,1,'2026-04-03','2026-10-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(27,'COM-2026-0043',33,1,1,'2026-05-24','2026-11-24','2026-06-19','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(28,'COM-2026-0045',35,1,1,'2026-08-30','2027-03-02',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(29,'COM-2026-0046',36,1,1,'2026-09-10','2027-03-10',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(30,'COM-2026-0047',37,1,1,'2026-04-16','2026-10-16','2026-05-07','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(31,'COM-2026-0049',39,1,2,'2026-09-10','2027-03-10',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(32,'COM-2026-0050',40,1,2,'2026-03-28','2026-09-28',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(33,'COM-2026-0051',41,1,2,'2026-08-25','2027-02-25',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(34,'COM-2026-0053',43,1,1,'2026-06-08','2026-12-08',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(35,'COM-2026-0054',44,1,1,'2026-04-20','2026-10-20',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(36,'COM-2026-0055',45,1,1,'2026-08-23','2027-02-23',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(37,'COM-2026-0057',47,1,1,'2026-05-03','2026-11-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(38,'COM-2026-0058',48,1,1,'2026-07-19','2027-01-19',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(39,'COM-2026-0059',49,1,1,'2026-04-12','2026-10-12','2026-04-29','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(40,'COM-2026-0061',51,1,1,'2026-06-13','2026-12-13',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(41,'COM-2026-0062',52,1,1,'2026-07-10','2027-01-10',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(42,'COM-2026-0063',53,1,1,'2026-07-09','2027-01-09','2026-07-28','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(43,'COM-2026-0065',55,1,3,'2026-06-26','2026-12-26',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(44,'COM-2026-0066',56,1,3,'2026-05-24','2026-11-24',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(45,'COM-2026-0067',57,1,3,'2026-03-26','2026-09-26','2026-04-10','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(46,'COM-2026-0069',59,1,1,'2026-03-24','2026-09-24',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(47,'COM-2026-0070',60,1,1,'2026-07-13','2027-01-13',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(48,'COM-2026-0071',61,1,1,'2026-05-12','2026-11-12','2026-06-08','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(49,'COM-2026-0073',63,1,1,'2026-06-14','2026-12-14',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(50,'COM-2026-0074',64,1,1,'2026-05-31','2026-12-01',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(51,'COM-2026-0075',65,1,1,'2026-08-17','2027-02-17',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(52,'COM-2026-0077',67,1,1,'2026-04-20','2026-10-20',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(53,'COM-2026-0078',68,1,1,'2026-08-07','2027-02-07',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(54,'COM-2026-0079',69,1,1,'2026-04-05','2026-10-05','2026-04-26','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(55,'COM-2026-0081',71,1,2,'2026-08-05','2027-02-05',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(56,'COM-2026-0082',72,1,2,'2026-06-18','2026-12-18',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(57,'COM-2026-0083',73,1,2,'2026-04-05','2026-10-05','2026-04-20','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(58,'COM-2026-0085',75,1,1,'2026-08-08','2027-02-08',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(59,'COM-2026-0086',76,1,1,'2026-09-07','2027-03-07',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(60,'COM-2026-0087',77,1,1,'2026-05-15','2026-11-15','2026-06-08','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(61,'COM-2026-0089',79,1,4,'2026-08-03','2027-02-03',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(62,'COM-2026-0090',80,1,4,'2026-05-24','2026-11-24',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(63,'COM-2026-0091',81,1,4,'2026-09-10','2027-03-10',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(64,'COM-2026-0093',83,1,1,'2026-07-09','2027-01-09',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(65,'COM-2026-0094',84,1,1,'2026-07-05','2027-01-05',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(66,'COM-2026-0095',85,1,1,'2026-09-09','2027-03-09',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(67,'COM-2026-0097',87,1,6,'2026-08-01','2027-02-01',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(68,'COM-2026-0098',88,1,6,'2026-05-28','2026-11-28',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(69,'COM-2026-0099',89,1,6,'2026-08-01','2027-02-01','2026-08-24','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(70,'COM-2026-0101',91,1,1,'2026-05-23','2026-11-23',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(71,'COM-2026-0102',92,1,1,'2026-04-06','2026-10-06',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(72,'COM-2026-0103',93,1,1,'2026-04-17','2026-10-17','2026-05-11','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(73,'COM-2026-0105',95,1,5,'2026-04-11','2026-10-11',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(74,'COM-2026-0106',96,1,5,'2026-08-30','2027-03-02',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(75,'COM-2026-0107',97,1,5,'2026-05-20','2026-11-20','2026-06-05','devuelto','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 03:07:00'),(76,'COM-2026-0109',99,1,1,'2026-09-01','2027-03-01',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(77,'COM-2026-0110',100,1,1,'2026-04-06','2026-10-06',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53'),(78,'COM-2026-0111',101,1,1,'2026-08-18','2027-02-18',NULL,'activo','Entrega de equipo en comodato gratuito Fundación Gamboa.',NULL,NULL,NULL,'2026-09-16 02:58:53','2026-09-16 02:58:53');
/*!40000 ALTER TABLE `comodatos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documentos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL DEFAULT 'General',
  `descripcion` text DEFAULT NULL,
  `archivo_nombre_original` varchar(255) NOT NULL,
  `archivo_path` varchar(255) NOT NULL,
  `archivo_extension` varchar(10) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `tamano_bytes` bigint(20) unsigned NOT NULL DEFAULT 0,
  `fecha_documento` date DEFAULT NULL,
  `sucursal_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_sucursal_id_foreign` (`sucursal_id`),
  KEY `documentos_user_id_foreign` (`user_id`),
  KEY `documentos_categoria_archivo_extension_index` (`categoria`,`archivo_extension`),
  CONSTRAINT `documentos_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_producto`
--

DROP TABLE IF EXISTS `estados_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estados_producto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `tipo_disponibilidad` enum('disponible','prestado','mantencion','baja') NOT NULL DEFAULT 'disponible',
  `badge_color` varchar(255) NOT NULL DEFAULT 'emerald',
  `descripcion` text DEFAULT NULL,
  `es_sistema` tinyint(1) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `estados_producto_nombre_unique` (`nombre`),
  UNIQUE KEY `estados_producto_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_producto`
--

LOCK TABLES `estados_producto` WRITE;
/*!40000 ALTER TABLE `estados_producto` DISABLE KEYS */;
INSERT INTO `estados_producto` VALUES (1,'Nuevo','nuevo','disponible','emerald','Equipo sin uso previa donación o compra.',1,1,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(2,'Usado (Excelente Estado)','usado_excelente','disponible','emerald','Equipo usado en excelentes condiciones operativas.',0,2,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(3,'Usado (Buen Estado)','usado_bueno','disponible','emerald','Equipo usado operativo con marcas menores de uso.',0,3,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(4,'Usado (Regular)','usado_regular','disponible','amber','Equipo usado operativo con desgaste visible.',0,4,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(5,'Reacondicionado','reacondicionado','disponible','sky','Equipo reparado o restaurado técnicamente por la fundación.',0,5,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(6,'En Comodato (Prestado)','prestado','prestado','amber','Equipo entregado a beneficiario en comodato activo.',1,6,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(7,'En Mantención / Taller','mantencion','mantencion','sky','Equipo en reparación, sanitización o revisión técnica.',1,7,'2026-09-15 05:31:02','2026-09-15 05:31:02'),(8,'Dado de Baja / Descartado','baja','baja','slate','Equipo no reparable o destruido fuera de servicio.',1,8,'2026-09-15 05:31:02','2026-09-15 05:31:02');
/*!40000 ALTER TABLE `estados_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_02_000001_create_productos_inventario_table',1),(5,'2026_09_02_000002_create_unidades_producto_table',1),(6,'2026_09_02_000003_create_beneficiarios_table',1),(7,'2026_09_02_000004_create_comodatos_table',1),(8,'2026_09_02_000005_create_comodato_items_table',1),(9,'2026_09_02_000006_create_movimientos_inventario_table',1),(10,'2026_09_02_000007_create_categorias_table',1),(11,'2026_09_14_190035_create_permission_tables',2),(12,'2026_09_14_200000_create_movimientos_financieros_table',3),(13,'2026_09_14_210000_add_proyecto_to_movimientos_financieros_table',4),(14,'2026_09_14_220000_create_proyectos_table',5),(15,'2026_09_14_230000_add_representante_fields_to_beneficiarios_table',6),(16,'2026_09_14_240000_add_documents_to_beneficiarios_table',7),(17,'2026_09_14_220737_add_sector_to_beneficiarios_table',8),(18,'2026_09_14_222837_add_representante_address_to_beneficiarios_table',9),(19,'2026_09_14_223543_create_categorias_finanzas_table',10),(20,'2026_09_14_250000_create_estados_producto_table',11),(21,'2026_09_15_000001_create_sucursales_table',12),(22,'2026_09_15_000002_add_sucursal_id_to_users_table',12),(23,'2026_09_15_000003_add_sucursal_id_to_unidades_producto_table',12),(24,'2026_09_15_000004_create_producto_sucursal_stock_table',12),(25,'2026_09_15_000005_add_sucursal_id_to_comodatos_and_beneficiarios_table',12),(26,'2026_09_15_000006_create_traslados_inventario_table',12),(27,'2026_09_15_000007_alter_tipo_in_movimientos_inventario_table',13),(28,'2026_09_15_220000_create_documentos_table',14);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',3),(2,'App\\Models\\User',1),(3,'App\\Models\\User',2);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_financieros`
--

DROP TABLE IF EXISTS `movimientos_financieros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimientos_financieros` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('ingreso','egreso') NOT NULL DEFAULT 'egreso',
  `concepto` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `proyecto` varchar(255) DEFAULT 'Fondo General / Operación',
  `monto` decimal(12,2) NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` text DEFAULT NULL,
  `comprobante_path` varchar(255) DEFAULT NULL,
  `comprobante_original_name` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movimientos_financieros_user_id_foreign` (`user_id`),
  CONSTRAINT `movimientos_financieros_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_financieros`
--

LOCK TABLES `movimientos_financieros` WRITE;
/*!40000 ALTER TABLE `movimientos_financieros` DISABLE KEYS */;
INSERT INTO `movimientos_financieros` VALUES (1,'egreso','Adquisición 4 Sillas de Ruedas Ergonómicas Plegables','Adquisición de Equipos Clínicos','Subvención Municipal Maipú 2026',380000.00,'2026-09-02','Factura #4092 Proveedor Ortopedia Central - Op #8050671','comprobantes/comprobante_ejemplo.png','factura_sillas_ruedas_4092.png',1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(2,'egreso','Compra 5 Colchones de Aire Antiescaras con Compresor','Insumos Kinésicos y Sanitarios','Subvención Municipal Maipú 2026',145000.00,'2026-09-04','Sistemas antiescaras para pacientes de Maipú y Providencia','comprobantes/comprobante_ejemplo.png','boleta_colchones_antiescaras.png',1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(3,'egreso','Mantención Técnica Semestral Camas Clínicas Eléctricas','Mantención y Reparación de Ayudas Técnicas','Fondo GORE Ayudas Técnicas 2026',120000.00,'2026-09-06','Servicio técnico especializado en revisión de motores y barandas',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(4,'egreso','Compra de Repuestos y Accesorios para Grúas de Traslado','Mantención y Reparación de Ayudas Técnicas','Fondo GORE Ayudas Técnicas 2026',85000.00,'2026-09-08','Arneses de sujeción y baterías de repuesto','comprobantes/comprobante_ejemplo.png','comprobante_repuestos_gruas.png',1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(5,'egreso','Combustible y Flete para Entrega de Camas en Terreno','Gastos Operativos y Logística','Fondo General / Operación',45000.00,'2026-09-10','Despacho e instalación de camas clínicas en comunas del sector poniente',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(6,'ingreso','Subvención Municipal Anual I. Municipalidad 2026','Subvención Municipal / Estatal','Subvención Municipal Maipú 2026',3500000.00,'2026-09-01','Aporte municipal para banco de ayudas técnicas y atención social','comprobantes/comprobante_ejemplo.png','comprobante_subvencion_municipal.png',1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(7,'ingreso','Donación Privada Empresa Colaboradora Ortopedia','Donaciones y Aportes de Colaboradores','Fondo GORE Ayudas Técnicas 2026',850000.00,'2026-09-05','Aporte directo para adquisición de equipamiento clínico',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(8,'egreso','Compra de 10 Andadores de Paso (Burritos de Aluminio)','Adquisición de Equipos Clínicos','Subvención Municipal Maipú 2026',190000.00,'2026-08-18','Andadores regulables en altura para beneficiarios del programa',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(9,'egreso','Insumos de Sanitización y Desinfección de Equipos','Insumos Kinésicos y Sanitarios','Fondo General / Operación',32000.00,'2026-08-22','Amonio cuaternario, pulverizadores y material de protección',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(10,'egreso','Compra de Bastones Canadienses y de 4 Apoyos','Insumos Kinésicos y Sanitarios','Fondo General / Operación',68000.00,'2026-08-24','Lote de 15 bastones ortopédicos de aluminio',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55'),(11,'ingreso','Recaudación Campaña Beneficio Ayudas Técnicas','Eventos y Actividades de Recaudación','Campaña Solidaria 2026',420000.00,'2026-08-22','Recaudación total actividad solidaria de la Fundación',NULL,NULL,1,'2026-09-14 23:56:55','2026-09-14 23:56:55');
/*!40000 ALTER TABLE `movimientos_financieros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_inventario`
--

DROP TABLE IF EXISTS `movimientos_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimientos_inventario` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `unidad_producto_id` bigint(20) unsigned DEFAULT NULL,
  `tipo` varchar(50) NOT NULL,
  `comodato_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `fecha` datetime NOT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movimientos_inventario_producto_id_foreign` (`producto_id`),
  KEY `movimientos_inventario_unidad_producto_id_foreign` (`unidad_producto_id`),
  KEY `movimientos_inventario_comodato_id_foreign` (`comodato_id`),
  KEY `movimientos_inventario_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `movimientos_inventario_comodato_id_foreign` FOREIGN KEY (`comodato_id`) REFERENCES `comodatos` (`id`),
  CONSTRAINT `movimientos_inventario_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos_inventario` (`id`),
  CONSTRAINT `movimientos_inventario_unidad_producto_id_foreign` FOREIGN KEY (`unidad_producto_id`) REFERENCES `unidades_producto` (`id`),
  CONSTRAINT `movimientos_inventario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_inventario`
--

LOCK TABLES `movimientos_inventario` WRITE;
/*!40000 ALTER TABLE `movimientos_inventario` DISABLE KEYS */;
INSERT INTO `movimientos_inventario` VALUES (1,1,1,'salida',1,1,'2026-09-03 18:41:27','Entrega en Comodato COM-2026-0001 a Ana Luisa Fernández Riquelme','2026-09-03 22:41:27','2026-09-03 22:41:27'),(2,5,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(3,6,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(4,7,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(5,8,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(6,9,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(7,10,NULL,'entrada',NULL,1,'2026-08-29 21:59:26','Stock inicial registrado por Seeder de Insumos de Alta Rotación','2026-09-04 01:59:26','2026-09-04 01:59:26'),(8,8,NULL,'salida',2,1,'2026-09-03 22:02:25','Entrega de stock 2 unidades en Comodato COM-2026-0002','2026-09-04 02:02:25','2026-09-04 02:02:25'),(9,1,2,'salida',3,1,'2026-09-12 21:17:45','Entrega en Comodato COM-2026-0003 a Pedro Antonio Gómez Silva','2026-09-13 00:17:45','2026-09-13 00:17:45'),(10,2,8,'salida',3,1,'2026-09-12 21:17:45','Entrega en Comodato COM-2026-0003 a Pedro Antonio Gómez Silva','2026-09-13 00:17:45','2026-09-13 00:17:45'),(11,5,NULL,'entrada',NULL,1,'2026-09-12 21:32:44','Ingreso de 10 unidades de stock genérico. test','2026-09-13 00:32:44','2026-09-13 00:32:44'),(12,1,11,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-005. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(13,1,12,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-006. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(14,1,13,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-007. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(15,1,14,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-008. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(16,1,15,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-009. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(17,1,16,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-010. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(18,1,17,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-011. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(19,1,18,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-012. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(20,1,19,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-013. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(21,1,20,'entrada',NULL,1,'2026-09-14 22:38:19','Ingreso de unidad PROD-CAM-01-014. Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(22,10,NULL,'entrada',NULL,1,'2026-09-14 22:55:16','Ingreso de 1000 unidades de stock genérico. Compra','2026-09-15 01:55:16','2026-09-15 01:55:16'),(23,10,NULL,'salida',4,1,'2026-09-15 01:10:26','Entrega de stock 1 unidades en Comodato COM-2026-0004','2026-09-15 04:10:26','2026-09-15 04:10:26'),(24,10,NULL,'entrada',4,1,'2026-09-15 00:00:00','Devolución de 1 unidades de stock genérico de Comodato COM-2026-0004','2026-09-15 04:25:52','2026-09-15 04:25:52'),(25,1,3,'traslado',NULL,1,'2026-09-15 22:46:45','Traslado de Casa Matriz - Villa Cardenal Silva Henríquez a Sucursal Cobre. Ref: TRSL-MDGEFN','2026-09-16 01:46:45','2026-09-16 01:46:45'),(26,13,41,'traslado',NULL,1,'2026-09-15 23:02:32','Traslado de Casa Matriz - Villa Cardenal Silva Henríquez a Sucursal Cobre. Ref: TRSL-7ULHKS','2026-09-16 02:02:32','2026-09-16 02:02:32'),(28,1,1,'entrada',1,3,'2026-09-16 00:00:00','Devolución de Comodato COM-2026-0001','2026-09-16 18:25:46','2026-09-16 18:25:46'),(29,10,NULL,'traslado',NULL,3,'2026-09-16 15:32:23','Traslado de 10 unidades desde Sede Central - Villa Cardenal Silva Henríquez hacia Sede El Cobre. Ref: TRSL-02DUBR','2026-09-16 18:32:23','2026-09-16 18:32:23');
/*!40000 ALTER TABLE `movimientos_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES ('admin@fundacion.org','$2y$12$vO3H4HGlh6giivVlrcYaKekFcA6/65/rrEfQqS2Zyxsm/xj2NZ0Sa','2026-09-15 04:51:47');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'ver-productos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(2,'crear-productos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(3,'editar-productos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(4,'eliminar-productos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(5,'ver-beneficiarios','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(6,'crear-beneficiarios','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(7,'editar-beneficiarios','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(8,'eliminar-beneficiarios','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(9,'ver-comodatos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(10,'crear-comodatos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(11,'editar-comodatos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(12,'eliminar-comodatos','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(13,'procesar-devolucion','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(14,'ver-reportes','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(15,'exportar-reportes','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(16,'gestionar-configuracion','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(17,'gestionar-usuarios','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(18,'gestionar-roles','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(19,'ver-finanzas','web','2026-09-14 22:47:43','2026-09-14 22:47:43'),(20,'crear-finanzas','web','2026-09-14 22:47:43','2026-09-14 22:47:43'),(21,'editar-finanzas','web','2026-09-14 22:47:43','2026-09-14 22:47:43'),(22,'eliminar-finanzas','web','2026-09-14 22:47:43','2026-09-14 22:47:43'),(23,'exportar-finanzas','web','2026-09-14 22:47:43','2026-09-14 22:47:43');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_sucursal_stock`
--

DROP TABLE IF EXISTS `producto_sucursal_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto_sucursal_stock` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `sucursal_id` bigint(20) unsigned NOT NULL,
  `stock_total` int(11) NOT NULL DEFAULT 0,
  `stock_disponible` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `producto_sucursal_stock_producto_id_sucursal_id_unique` (`producto_id`,`sucursal_id`),
  KEY `producto_sucursal_stock_sucursal_id_foreign` (`sucursal_id`),
  CONSTRAINT `producto_sucursal_stock_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos_inventario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `producto_sucursal_stock_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_sucursal_stock`
--

LOCK TABLES `producto_sucursal_stock` WRITE;
/*!40000 ALTER TABLE `producto_sucursal_stock` DISABLE KEYS */;
INSERT INTO `producto_sucursal_stock` VALUES (1,3,1,20,17,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(2,5,1,160,130,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(3,6,1,200,165,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(4,7,1,100,85,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(5,8,1,180,138,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(6,9,1,90,75,'2026-09-16 00:38:42','2026-09-16 00:38:42'),(7,10,1,1050,1050,'2026-09-16 00:38:42','2026-09-16 18:32:57'),(8,3,3,9,9,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(9,5,3,4,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(10,6,3,6,3,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(11,7,3,7,9,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(12,8,3,8,10,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(13,9,3,10,10,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(14,10,3,5,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(15,3,4,4,7,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(16,5,4,4,7,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(17,6,4,6,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(18,7,4,10,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(19,8,4,4,9,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(20,9,4,4,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(21,10,4,10,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(22,3,5,9,8,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(23,5,5,11,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(24,6,5,8,5,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(25,7,5,4,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(26,8,5,9,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(27,9,5,7,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(28,10,5,5,6,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(29,3,6,4,10,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(30,5,6,10,3,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(31,6,6,4,9,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(32,7,6,4,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(33,8,6,4,8,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(34,9,6,12,9,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(35,10,6,5,3,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(36,3,7,7,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(37,5,7,12,6,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(38,6,7,9,7,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(39,7,7,9,4,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(40,8,7,5,7,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(41,9,7,12,10,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(42,10,7,11,8,'2026-09-16 03:03:00','2026-09-16 03:03:00'),(43,10,2,10,0,'2026-09-16 18:32:22','2026-09-16 18:32:57');
/*!40000 ALTER TABLE `producto_sucursal_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_inventario`
--

DROP TABLE IF EXISTS `productos_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos_inventario` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `estado_fisico` varchar(255) NOT NULL DEFAULT 'Nuevo',
  `tipo` enum('serializado','stock_generico') NOT NULL DEFAULT 'serializado',
  `descripcion` text DEFAULT NULL,
  `stock_generico_total` int(11) NOT NULL DEFAULT 0,
  `stock_generico_disponible` int(11) NOT NULL DEFAULT 0,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `productos_inventario_codigo_unique` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_inventario`
--

LOCK TABLES `productos_inventario` WRITE;
/*!40000 ALTER TABLE `productos_inventario` DISABLE KEYS */;
INSERT INTO `productos_inventario` VALUES (1,'PROD-CAM-01','Cama Clínica Eléctrica 3 Posiciones','Camas y Catres','Nuevo','serializado','Catre clínico articulado eléctrico con barandas de seguridad laterales, control remoto y soporte de suero.',0,0,'activo','Equipos de alta demanda para pacientes postrados.','2026-09-03 03:35:57','2026-09-15 05:51:49'),(2,'PROD-SIL-01','Silla de Ruedas Ergonómica Plegable','Sillas de Ruedas','Nuevo','serializado','Silla de ruedas liviana de estructura de aluminio, frenos bilaterales de mano y reposapiés abatibles.',0,0,'activo','Facilita traslado diario de beneficiarios.','2026-09-03 03:35:57','2026-09-15 05:51:49'),(3,'PROD-COL-01','Colchón de Aire Antiescaras con Compresor','Colchones','Nuevo','stock_generico','Sistema de alivio de presión por aire alternante para prevención de úlceras.',20,17,'activo',NULL,'2026-09-03 03:35:57','2026-09-03 03:35:57'),(4,'PROD-AND-01','Andador de Aluminio Plegable (Burrito)','Andadores','Nuevo','serializado','Andador de paso ultraliviano regulable en altura con regatones de goma antideslizantes.',0,0,'activo','Liviano y fácil de transportar en vehículo.','2026-09-03 03:35:57','2026-09-15 05:51:49'),(5,'INSU-PAN-M','Pañales Adulto Talla M (Paquete 10 Unidades)','Insumos Desechables y Pañales','Nuevo','stock_generico','Pañales anatómicos para adulto con barrera antidesbordes y gel súper absorbente (Talla M).',160,130,'activo','Donaciones frecuentes de laboratorios y particulares. Alta rotación mensual.','2026-09-04 01:59:26','2026-09-13 00:32:44'),(6,'INSU-PAN-L','Pañales Adulto Talla L (Paquete 10 Unidades)','Insumos Desechables y Pañales','Nuevo','stock_generico','Pañales para adulto de alta absorción nocturna y cintas reajustables (Talla L).',200,165,'activo','El insumo más solicitado por familias de pacientes postrados.','2026-09-04 01:59:26','2026-09-04 01:59:26'),(7,'INSU-PAN-XL','Pañales Adulto Talla XL (Paquete 10 Unidades)','Insumos Desechables y Pañales','Nuevo','stock_generico','Pañales extra grandes anatómicos para adultos de alta densidad y mayor capacidad.',100,85,'activo','Uso en pacientes con requerimiento especial.','2026-09-04 01:59:26','2026-09-04 01:59:26'),(8,'INSU-SAB-01','Sabanillas Clínicas Desechables 60x90cm (Paquete 10u)','Insumos Desechables y Pañales','Nuevo','stock_generico','Sabanillas protectoras impermeables de colchón 60x90cm para mudanza e higiene.',180,138,'activo','Complemento indispensable para camas clínicas.','2026-09-04 01:59:26','2026-09-04 02:02:25'),(9,'INSU-APO-01','Apósitos Multiuso Clínicos (Caja 20 Unidades)','Nutrición y Cuidados Clínicos','Nuevo','stock_generico','Apósitos de curación altamente absorbentes para protección cutánea y curación de escaras.',90,75,'activo','Para curaciones en domicilio por parte de familiares o enfermería.','2026-09-04 01:59:26','2026-09-04 01:59:26'),(10,'INSU-GUA-L','Guantes de Examen Nitrilo Talla L (Caja 100 Unidades)','Protección y Sanitarios','Nuevo','stock_generico','Guantes clínicos libres de látex para curación, mudanza e higiene de pacientes.',1060,1050,'activo','Insumo de protección personal.','2026-09-04 01:59:26','2026-09-15 04:25:52'),(11,'PROD-GRU-01','Grúa de Traslado Pacientes Hidráulica','Grúas de Traslado','Nuevo','serializado','Grúa médica de transferencia con arnés universal acolchado para levantar y mover pacientes de hasta 150 kg.',0,0,'activo','Evita lesiones en cuidadores.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(12,'PROD-BAN-01','Silla de Ducha con Ruedas y W.C. Adaptado','Sillas de Baño / W.C.','Nuevo','serializado','Silla multipropósito inoxidable para higiene en ducha y depósito bacín extraíble.',0,0,'activo','Resistente al agua e insumos de aseo.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(13,'PROD-BAS-01','Bastón Canadiense de Aluminio Regulable (Par)','Bastones y Muletas','Nuevo','serializado','Par de bastones de apoyo antebraquial ergonómicos de altura ajustable.',0,0,'activo','Soporta hasta 120 kg.','2026-09-15 05:51:49','2026-09-15 05:51:49');
/*!40000 ALTER TABLE `productos_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proyectos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `presupuesto_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `proyectos_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (1,'Subvención Municipal Maipú 2026','PROY-MAIPU-2026','Fondo municipal para banco de sillas de ruedas y catres clínicos',3500000.00,'activo','2026-09-14 23:56:55','2026-09-14 23:56:55'),(2,'Fondo GORE Ayudas Técnicas 2026','PROY-GORE-2026','Financiamiento regional para mantención técnica y repuestos de equipamiento',400000.00,'activo','2026-09-14 23:56:55','2026-09-14 23:56:55'),(3,'Campaña Solidaria 2026','PROY-CAMP-2026','Fondo recaudación actividades sociales',1200000.00,'activo','2026-09-14 23:56:55','2026-09-14 23:56:55'),(4,'Fondo General / Operación','PROY-GEN-OPER','Fondo operacional continuo de Fundación Gamboa',0.00,'activo','2026-09-14 23:56:55','2026-09-15 00:19:00');
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(3,1),(3,2),(3,3),(4,1),(4,2),(5,1),(5,2),(5,3),(6,1),(6,2),(6,3),(7,1),(7,2),(7,3),(8,1),(8,2),(9,1),(9,2),(9,3),(10,1),(10,2),(10,3),(11,1),(11,2),(11,3),(12,1),(12,2),(13,1),(13,2),(13,3),(14,1),(14,2),(14,3),(15,1),(15,2),(16,1),(16,2),(17,1),(18,1),(19,1),(19,2),(20,1),(20,2),(21,1),(21,2),(22,1),(22,2),(23,1),(23,2);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super_admin','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(2,'admin','web','2026-09-14 22:10:35','2026-09-14 22:10:35'),(3,'cooperador','web','2026-09-14 22:10:35','2026-09-14 22:10:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('FqH1fDLFxTmGfHdwDLORB5xYbnInY1HqsTwPsoGJ',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJZd3RQSmR5UjhVaTBoREdPdFd0blFjaHllMlZhSnFyYU51NG9SOHA2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJ1cmwiOltdLCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MX0=',1790193854),('leDcFQF5v1GT1UXgfd4DZTbL7plYcroCxKhnxSeY',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Electron/44.2.0 Safari/537.36','eyJfdG9rZW4iOiJxNDcxeXFXZzRPeXFSZlc3c25nTTg3OThxRUF6bnE0YjAwb2lUc2ZGIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1789569293),('mMlF7bZ51hP7t8qGkirFyJBhNdRWcO4sbubPX7WP',3,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.49585.0 Chrome/152.0.7977.76 Safari/537.36','eyJfdG9rZW4iOiJDOFhZbDBlVUF5aE1WRUg3ZmhhMHlmMDdXMWxtSkc1aFFOWnhtTGt0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDIwXC9iZW5lZmljaWFyaW9zXC9yZXBvcnRlXC9wZGYiLCJyb3V0ZSI6ImJlbmVmaWNpYXJpb3MucGRmIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwidXJsIjpbXSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjN9',1789572792);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursales`
--

DROP TABLE IF EXISTS `sucursales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sucursales` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `encargado_principal_id` bigint(20) unsigned DEFAULT NULL,
  `es_casa_matriz` tinyint(1) NOT NULL DEFAULT 0,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sucursales_codigo_unique` (`codigo`),
  KEY `sucursales_encargado_principal_id_foreign` (`encargado_principal_id`),
  CONSTRAINT `sucursales_encargado_principal_id_foreign` FOREIGN KEY (`encargado_principal_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursales`
--

LOCK TABLES `sucursales` WRITE;
/*!40000 ALTER TABLE `sucursales` DISABLE KEYS */;
INSERT INTO `sucursales` VALUES (1,'Sede Central - Villa Cardenal Silva Henríquez','SEDE-CENTRAL','Villa Cardenal Silva Henríquez',NULL,NULL,1,1,'2026-09-16 00:38:42','2026-09-16 03:06:17'),(2,'Sede El Cobre','SEDE-ELCOBRE','Sector Cobre',NULL,NULL,0,1,'2026-09-16 01:30:11','2026-09-16 03:06:17'),(3,'Sede Cerrillos','SEDE-CERRILLOS','Av. Principal Cerrillos N° 450, Sector Cerrillos, Catemu','+56 34 245 1001',1,0,1,'2026-09-16 03:03:00','2026-09-16 03:07:00'),(4,'Sede Santa Isabel','SEDE-SANTAISABEL','Camino Rural Santa Isabel N° 88, Sector Santa Isabel, Catemu','+56 34 245 1002',1,0,1,'2026-09-16 03:03:00','2026-09-16 03:07:00'),(5,'Sede Quebrachal','SEDE-QUEBRACHAL','Sector El Quebrachal Lote 12, Catemu','+56 34 245 1003',1,0,1,'2026-09-16 03:03:00','2026-09-16 03:07:00'),(6,'Sede Los Corrales','SEDE-LOSCORRALES','Pasaje Los Corrales N° 18, Sector Los Corrales, Catemu','+56 34 245 1004',1,0,1,'2026-09-16 03:03:00','2026-09-16 03:07:00'),(7,'Sede Chagres','SEDE-CHAGRES','Ruta 60 Sector Chagres N° 102, Catemu','+56 34 245 1005',1,0,1,'2026-09-16 03:03:00','2026-09-16 03:07:00');
/*!40000 ALTER TABLE `sucursales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traslados_inventario`
--

DROP TABLE IF EXISTS `traslados_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `traslados_inventario` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo_traslado` varchar(255) NOT NULL,
  `sucursal_origen_id` bigint(20) unsigned NOT NULL,
  `sucursal_destino_id` bigint(20) unsigned NOT NULL,
  `producto_id` bigint(20) unsigned NOT NULL,
  `unidad_producto_id` bigint(20) unsigned DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `usuario_emisor_id` bigint(20) unsigned NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'completado',
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `traslados_inventario_codigo_traslado_unique` (`codigo_traslado`),
  KEY `traslados_inventario_sucursal_origen_id_foreign` (`sucursal_origen_id`),
  KEY `traslados_inventario_sucursal_destino_id_foreign` (`sucursal_destino_id`),
  KEY `traslados_inventario_producto_id_foreign` (`producto_id`),
  KEY `traslados_inventario_unidad_producto_id_foreign` (`unidad_producto_id`),
  KEY `traslados_inventario_usuario_emisor_id_foreign` (`usuario_emisor_id`),
  CONSTRAINT `traslados_inventario_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos_inventario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `traslados_inventario_sucursal_destino_id_foreign` FOREIGN KEY (`sucursal_destino_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `traslados_inventario_sucursal_origen_id_foreign` FOREIGN KEY (`sucursal_origen_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `traslados_inventario_unidad_producto_id_foreign` FOREIGN KEY (`unidad_producto_id`) REFERENCES `unidades_producto` (`id`) ON DELETE SET NULL,
  CONSTRAINT `traslados_inventario_usuario_emisor_id_foreign` FOREIGN KEY (`usuario_emisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traslados_inventario`
--

LOCK TABLES `traslados_inventario` WRITE;
/*!40000 ALTER TABLE `traslados_inventario` DISABLE KEYS */;
INSERT INTO `traslados_inventario` VALUES (5,'TRSL-MDGEFN',1,2,1,3,1,1,'completado','Prueba','2026-09-16 01:46:45','2026-09-16 01:46:45'),(6,'TRSL-7ULHKS',1,2,13,41,1,1,'completado',NULL,'2026-09-16 02:02:32','2026-09-16 02:02:32');
/*!40000 ALTER TABLE `traslados_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades_producto`
--

DROP TABLE IF EXISTS `unidades_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unidades_producto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `sucursal_id` bigint(20) unsigned NOT NULL DEFAULT 1,
  `codigo_unidad` varchar(255) NOT NULL,
  `estado` enum('disponible','prestado','mantencion','baja') NOT NULL DEFAULT 'disponible',
  `estado_fisico` varchar(255) NOT NULL DEFAULT 'Nuevo',
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unidades_producto_codigo_unidad_unique` (`codigo_unidad`),
  KEY `unidades_producto_producto_id_foreign` (`producto_id`),
  KEY `unidades_producto_sucursal_id_foreign` (`sucursal_id`),
  CONSTRAINT `unidades_producto_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos_inventario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `unidades_producto_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_producto`
--

LOCK TABLES `unidades_producto` WRITE;
/*!40000 ALTER TABLE `unidades_producto` DISABLE KEYS */;
INSERT INTO `unidades_producto` VALUES (1,1,1,'CAM-001','disponible','Nuevo','Excelente estado clínico','2026-09-03 03:35:57','2026-09-16 18:25:46'),(2,1,1,'CAM-002','prestado','Nuevo','Excelente estado clínico','2026-09-03 03:35:57','2026-09-13 00:17:45'),(3,1,2,'CAM-003','prestado','Nuevo','Excelente estado clínico','2026-09-03 03:35:57','2026-09-16 02:58:19'),(4,1,1,'CAM-004','mantencion','Nuevo','Motor en mantención preventiva','2026-09-03 03:35:57','2026-09-03 03:35:57'),(5,2,2,'SIL-001','prestado','Nuevo','Desinfectada y sanitizada','2026-09-03 03:35:57','2026-09-16 02:58:53'),(6,2,1,'SIL-002','prestado','Nuevo','Desinfectada y sanitizada','2026-09-03 03:35:57','2026-09-16 02:58:53'),(7,2,2,'SIL-003','prestado','Nuevo','Desinfectada y sanitizada','2026-09-03 03:35:57','2026-09-16 02:58:53'),(8,2,1,'SIL-004','prestado','Nuevo','Desinfectada y sanitizada','2026-09-03 03:35:57','2026-09-13 00:17:45'),(9,4,1,'AND-001','prestado','Nuevo',NULL,'2026-09-03 03:35:57','2026-09-16 02:58:53'),(10,4,2,'AND-002','prestado','Nuevo',NULL,'2026-09-03 03:35:57','2026-09-16 02:58:53'),(11,1,1,'PROD-CAM-01-005','prestado','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 02:58:53'),(12,1,1,'PROD-CAM-01-006','prestado','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 02:58:53'),(13,1,1,'PROD-CAM-01-007','prestado','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 02:58:53'),(14,1,3,'PROD-CAM-01-008','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 03:03:00'),(15,1,1,'PROD-CAM-01-009','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(16,1,5,'PROD-CAM-01-010','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 03:03:00'),(17,1,1,'PROD-CAM-01-011','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 18:06:15'),(18,1,7,'PROD-CAM-01-012','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 03:03:00'),(19,1,1,'PROD-CAM-01-013','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-15 01:38:19'),(20,1,4,'PROD-CAM-01-014','disponible','Nuevo','Proyecto test','2026-09-15 01:38:19','2026-09-16 03:03:00'),(21,1,1,'CAM-2026-001','disponible','Nuevo','Ingresada por donación corporativa. 100% operativa.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(22,1,6,'CAM-2026-002','disponible','Usado (Excelente Estado)','Revisión técnica al día. Sanitizada.','2026-09-15 05:51:49','2026-09-16 03:03:00'),(23,1,1,'CAM-2026-003','disponible','Usado (Buen Estado)','Pequeño detalle estético en pintura. Funcionamiento impecable.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(24,1,1,'CAM-2026-004','mantencion','En Mantención / Taller','En taller para cambio de cable de control y engrase de motor.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(25,1,3,'CAM-2026-005','disponible','Reacondicionado','Reacondicionada con motores nuevos.','2026-09-15 05:51:49','2026-09-16 03:03:00'),(26,2,1,'SIL-2026-001','prestado','Nuevo','En caja sellada de bodega.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(27,2,1,'SIL-2026-002','prestado','Usado (Excelente Estado)','Ruedas y tapiz impecables.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(28,2,1,'SIL-2026-003','prestado','Usado (Buen Estado)','Uso normal. Cojín antiescaras incluido.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(29,2,1,'SIL-2026-004','disponible','Usado (Regular)','Requiere ajuste leve en freno izquierdo.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(30,2,1,'SIL-2026-005','baja','Dado de Baja / Descartado','Estructura fisurada. Retirada de uso por seguridad.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(31,11,1,'GRU-2026-001','prestado','Nuevo','Con arnés talla L completamente nuevo.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(32,11,1,'GRU-2026-002','prestado','Usado (Excelente Estado)','Pistón hidráulico probado con carga.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(33,11,1,'GRU-2026-003','mantencion','En Mantención / Taller','Cambio de sellos hidráulicos preventivo.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(34,12,2,'BAN-2026-001','prestado','Nuevo','Nuevo ingreso en bodega.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(35,12,1,'BAN-2026-002','prestado','Usado (Excelente Estado)','Sanitizado clínicamente.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(36,12,2,'BAN-2026-003','prestado','Usado (Buen Estado)','Incluye receptáculo completo.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(37,4,1,'AND-2026-001','prestado','Nuevo','0 km, en envoltorio.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(38,4,1,'AND-2026-002','prestado','Usado (Excelente Estado)','Regatones nuevos instalados.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(39,4,5,'AND-2026-003','disponible','Reacondicionado','Ajustes mecánicos al día.','2026-09-15 05:51:49','2026-09-16 03:03:00'),(40,4,1,'AND-2026-004','disponible','Usado (Regular)','Marcas menores de uso.','2026-09-15 05:51:49','2026-09-15 05:51:49'),(41,13,2,'BAS-2026-001','prestado','Nuevo','Par sin uso.','2026-09-15 05:51:49','2026-09-16 02:58:53'),(42,13,1,'BAS-2026-002','prestado','Usado (Excelente Estado)','Empuñaduras en perfecto estado.','2026-09-15 05:51:49','2026-09-16 02:58:53');
/*!40000 ALTER TABLE `unidades_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'operaciones',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `sucursal_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_sucursal_id_foreign` (`sucursal_id`),
  CONSTRAINT `users_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrador Sistema','admin@fundacion.org','admin',NULL,'$2y$12$Mq7ChI0pz2GEhx0BmykHjOI.skfzYsG4Sod7cTkOjWSV7cBe.ZBKG',NULL,1,'2026-09-03 03:35:57','2026-09-03 03:35:57'),(2,'Operador Logístico','operaciones@fundacion.org','operaciones',NULL,'$2y$12$0DhjXVlU/fkqsJw6APqPTuM6vZyGvEp6XVB6DY05uXVShJzdwSQ4q',NULL,1,'2026-09-03 03:35:57','2026-09-03 03:35:57'),(3,'Super Administrador','superadmin@fundacion.org','super_admin',NULL,'$2y$12$yRQlSRx/Aod4OCQJZpqTuech3KiIQKQLBsX3rDYjXp4f3BxubHLbm',NULL,1,'2026-09-14 22:10:36','2026-09-14 22:10:36'),(4,'Usuario Prueba','prueba@fundacion.org','operaciones',NULL,'$2y$12$Qk5ZvhLMctN2TIA2oPtTY.yXZ9lZbDWPmTkxBVDb3Yc5zsPlnL8TO',NULL,NULL,'2026-09-16 02:46:10','2026-09-16 02:46:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23 17:05:17
