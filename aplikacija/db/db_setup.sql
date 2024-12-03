-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Nov 07, 2024 at 09:37 PM
-- Server version: 9.1.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isBoss` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employees`
--

INSERT IGNORE INTO `employees` (`id`, `name`, `email`, `username`, `password`, `isBoss`) VALUES
(1, 'John Doe', 'john.doe@example.com', 'john', '$2b$10$XVscmkUtAnWh5FdKysBXg.8SNo1tCnVwQOPUP0/y0i2EGe3q7.r3a', 0),
(2, 'Jane Smith', 'jane.smith@example.com', 'jane', '$2b$10$XVscmkUtAnWh5FdKysBXg.8SNo1tCnVwQOPUP0/y0i2EGe3q7.r3a', 1),
(3, 'Bob Johnson', 'bob.johnson@example.com', 'bob', '$2b$10$XVscmkUtAnWh5FdKysBXg.8SNo1tCnVwQOPUP0/y0i2EGe3q7.r3a', 0);

-- --------------------------------------------------------

--
-- Table structure for table `work_entries`
--

DROP TABLE IF EXISTS `work_entries`;
CREATE TABLE `work_entries` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `hours_worked` decimal(4,2) NOT NULL,
  `description` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `work_entries`
--

INSERT IGNORE INTO `work_entries` (`id`, `employee_id`, `date`, `hours_worked`, `description`, `updated_at`) VALUES
(1, 1, '2024-11-21', 12.00, 'test', '2024-11-07 21:13:43'),
(2, 2, '2024-11-06', 7.00, 'Worked on documentation', '2024-11-07 18:01:13'),
(3, 3, '2024-11-05', 6.00, 'Attended team meeting', '2024-11-07 18:01:13'),
(4, 1, '2024-11-22', 12.00, 'teeeeeeeeeeeeeeeeeeeeeeee', '2024-11-07 21:14:23'),
(5, 1, '2024-11-15', 42.00, 'ttttteeeesssttt', '2024-11-07 21:15:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `work_entries`
--
ALTER TABLE `work_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `work_entries`
--
ALTER TABLE `work_entries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `work_entries`
--
ALTER TABLE `work_entries`
  ADD CONSTRAINT `work_entries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
