-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: interactive
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `PropertyID` int NOT NULL,
  `PropertyName` varchar(255) DEFAULT NULL,
  `PropertyType` varchar(255) DEFAULT NULL,
  `Bathrooms` float DEFAULT NULL,
  `Bedrooms` int DEFAULT NULL,
  `SalePrice` int DEFAULT NULL,
  `ZipCode` varchar(255) DEFAULT NULL,
  `NewConstruction` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PropertyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'Cozy Cottage','Multiplex',3,6,280000,'98002','FALSKT','00FC30M41U9X','./0G0VJO0TKJAH.jpg'),(2,'Lakeview Manor','Single Family',3.75,4,1000000,'98166','SANT','03HWK80EXDW9','./img/03HWK80EXDW9.jpg'),(3,'Sunny Villa','Single Family',1.75,4,745000,'98166','FALSKT','03VX6PD8CRJ7',NULL),(4,'Riverside Retreat','Single Family',3.75,5,425000,'98168','FALSKT','082I5VIWXZ0E',NULL),(5,'Urban Loft','Single Family',1.75,4,240000,'98168','FALSKT','0G0VJO0TKJAH',NULL),(6,'Mountain Hideaway','Townhouse',1.5,2,349900,'98144','SANT','0N646IFYO6KP',NULL),(7,'Beachfront Bungalow','Single Family',1.5,3,327500,'98178','FALSKT','0SFS1LP5FSR2',NULL),(8,'Cityscape Condo','Single Family',1.75,4,347000,'98178','FALSKT','0UC5H3ZIO6W7',NULL),(9,'Country Estate','Single Family',1,2,220400,'98032','FALSKT','0UNMPHBUXYW7',NULL),(10,'Luxury Penthouse','Multiplex',2,4,437500,'98055','FALSKT','0V7UYVT5ECPY',NULL);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-28 18:34:25
