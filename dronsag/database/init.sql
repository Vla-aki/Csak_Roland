-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2026. Ápr 14. 14:17
-- Kiszolgáló verziója: 8.0.45
-- PHP verzió: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `dronsag`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bids`
--

CREATE TABLE `bids` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `message` text,
  `estimated_days` int DEFAULT NULL,
  `status` enum('pending','accepted','rejected','withdrawn') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `bids`
--

INSERT INTO `bids` (`id`, `project_id`, `driver_id`, `amount`, `message`, `estimated_days`, `status`, `created_at`, `updated_at`) VALUES
(3, 4, 12, 5000000.00, 'Mert egy baromi jo pilota vagyok', 2, 'accepted', '2026-04-13 13:25:14', '2026-04-13 17:21:12'),
(6, 4, 16, 500.00, 'Utasítsad el test', 20, 'rejected', '2026-04-13 16:52:20', '2026-04-13 17:21:12'),
(7, 6, 12, 27500.00, 'Testtt', 1, 'accepted', '2026-04-13 23:52:51', '2026-04-13 23:53:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `contracts`
--

CREATE TABLE `contracts` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `bid_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','completed','cancelled','disputed') DEFAULT 'active',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `payment_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `contracts`
--

INSERT INTO `contracts` (`id`, `project_id`, `bid_id`, `customer_id`, `driver_id`, `amount`, `start_date`, `end_date`, `status`, `payment_status`, `payment_date`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 4, 3, 11, 12, 5000000.00, NULL, NULL, 'completed', 'paid', NULL, '2026-04-13 23:49:30', '2026-04-13 17:21:12', '2026-04-13 23:49:30'),
(2, 6, 7, 11, 12, 27500.00, NULL, NULL, 'completed', 'paid', NULL, '2026-04-14 00:12:01', '2026-04-13 23:53:04', '2026-04-14 00:12:01');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `contract_milestones`
--

CREATE TABLE `contract_milestones` (
  `id` int NOT NULL,
  `contract_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  `completed_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `contract_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `contract_id`, `message`, `is_read`, `read_at`, `created_at`) VALUES
(1, 11, 11, NULL, 'Test', 1, '2026-04-13 13:08:30', '2026-04-13 13:08:22'),
(2, 11, 11, NULL, 'a', 1, '2026-04-13 13:09:11', '2026-04-13 13:09:08'),
(3, 11, 11, NULL, 'Hallooo', 1, '2026-04-13 13:09:51', '2026-04-13 13:09:49'),
(4, 11, 11, NULL, 'aasdsad', 1, '2026-04-13 13:22:51', '2026-04-13 13:22:44'),
(5, 11, 11, NULL, 'asdasd', 1, '2026-04-13 13:22:51', '2026-04-13 13:22:46'),
(6, 11, 11, NULL, 'Halo', 1, '2026-04-13 13:23:18', '2026-04-13 13:22:59'),
(7, 12, 11, NULL, 'Üdv! ', 1, '2026-04-13 16:05:29', '2026-04-13 13:25:33'),
(8, 12, 11, NULL, '😀', 1, '2026-04-13 16:05:29', '2026-04-13 13:26:06'),
(9, 12, 11, NULL, 'http://localhost:5000/uploads/1776087925581-477827538.gif', 1, '2026-04-13 16:05:29', '2026-04-13 13:45:27'),
(10, 12, 11, NULL, 'http://localhost:5000/uploads/1776088062035-967465131.png', 1, '2026-04-13 16:05:29', '2026-04-13 13:47:45'),
(11, 12, 11, NULL, 'http://localhost:5000/uploads/1776089563077-64917305.png', 1, '2026-04-13 16:05:29', '2026-04-13 14:12:47'),
(12, 12, 11, NULL, 'http://localhost:5000/uploads/1776096293967-780440133.jpg', 1, '2026-04-13 16:05:29', '2026-04-13 16:04:57'),
(13, 11, 11, NULL, 'Halooo', 1, '2026-04-13 16:44:50', '2026-04-13 16:44:44'),
(14, 11, 12, NULL, 'mo', 1, '2026-04-13 19:11:01', '2026-04-13 16:44:49'),
(15, 12, 11, NULL, 'Oh igen', 1, '2026-04-13 20:09:31', '2026-04-13 19:11:04'),
(16, 12, 11, NULL, 'Mormolin', 1, '2026-04-13 20:09:31', '2026-04-13 19:11:12'),
(17, 12, 11, NULL, 'Spumbirburbaram', 1, '2026-04-13 20:09:31', '2026-04-13 19:11:22'),
(18, 11, 12, NULL, 'http://localhost:5000/uploads/1776110998692-477443760.sql', 1, '2026-04-13 22:05:59', '2026-04-13 20:10:00'),
(19, 11, 12, NULL, 'http://localhost:5000/uploads/1776111033443-664648828.gif', 1, '2026-04-13 22:05:59', '2026-04-13 20:10:34'),
(20, 11, 12, 1, 'Szoval', 1, '2026-04-13 22:05:59', '2026-04-13 20:11:51'),
(21, 11, 12, 1, 'Aham', 1, '2026-04-13 22:05:59', '2026-04-13 20:11:55'),
(22, 11, 12, 1, 'Ezt latja a pilota is?', 1, '2026-04-13 22:05:59', '2026-04-13 20:12:00'),
(23, 11, 12, NULL, '😉', 1, '2026-04-13 22:05:59', '2026-04-13 20:30:21'),
(24, 12, 11, NULL, 'Ahaaaaaa', 1, '2026-04-13 22:11:28', '2026-04-13 22:09:03'),
(25, 12, 11, NULL, 'Hat hogy a viharba ne', 1, '2026-04-13 22:11:28', '2026-04-13 22:09:09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('bid','message','contract','payment','review') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `is_read`, `link`, `created_at`) VALUES
(1, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:08:22'),
(2, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:09:08'),
(3, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:09:49'),
(4, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:22:44'),
(5, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:22:46'),
(6, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 13:22:59'),
(7, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 13:25:33'),
(8, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 13:26:06'),
(9, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 13:45:27'),
(10, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 13:47:45'),
(11, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 14:12:47'),
(12, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 16:04:57'),
(13, 11, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 16:44:44'),
(14, 12, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 16:44:49'),
(15, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 19:11:04'),
(16, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 19:11:12'),
(17, 11, 'message', 'Új üzenet', 'TestP üzent neked!', 1, '/messages', '2026-04-13 19:11:22'),
(18, 12, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 20:10:00'),
(19, 12, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 20:10:34'),
(20, 12, 'message', 'Új üzenet', 'TestM üzent neked!', 1, '/messages', '2026-04-13 20:30:21'),
(22, 11, 'message', 'Új üzenet', 'TestP küldött 2 új üzenetet!', 0, '/messages', '2026-04-13 22:09:09'),
(23, 12, 'bid', 'Ajánlat elfogadva!', 'Gratulálunk! A(z) \"Testt\" projektre tett ajánlatodat elfogadták.', 0, '/contract/2', '2026-04-13 23:53:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `code`, `expires_at`, `created_at`) VALUES
(5, 'testm@gmail.com', '101324', '2026-04-14 04:12:31', '2026-04-14 03:57:31');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image_url` longtext,
  `category` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `portfolio`
--

INSERT INTO `portfolio` (`id`, `user_id`, `title`, `image_url`, `category`, `created_at`) VALUES
(8, 12, NULL, 'http://localhost:5000/uploads/1776118122396-452231463.png', NULL, '2026-04-13 22:08:43');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('photography','videography','inspection','mapping','delivery') NOT NULL,
  `location` varchar(100) NOT NULL,
  `budget_type` enum('fix','hourly') NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `deadline` date NOT NULL,
  `status` enum('active','pending','completed','cancelled') DEFAULT 'active',
  `featured` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `proposals_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `projects`
--

INSERT INTO `projects` (`id`, `user_id`, `title`, `description`, `category`, `location`, `budget_type`, `budget`, `deadline`, `status`, `featured`, `views`, `proposals_count`, `created_at`, `updated_at`) VALUES
(4, 11, 'Test', 'Test Test Test Test Test Test Test ', 'videography', 'Keszthely', 'fix', 5000000.00, '2026-05-01', 'completed', 0, 0, 2, '2026-04-12 21:15:10', '2026-04-13 17:21:12'),
(6, 11, 'Testt', 'Test Test Test Test Test Test ', 'videography', 'Budapest', 'fix', 27500.00, '2026-04-14', 'completed', 0, 0, 1, '2026-04-13 23:50:08', '2026-04-13 23:53:04'),
(7, 21, 'Automata Teszt Projekt', 'Ez egy Selenium robottal automatikusan létrehozott projekt.', 'videography', 'Budapest', 'fix', 150000.00, '2026-12-31', 'active', 0, 0, 0, '2026-04-14 03:53:46', '2026-04-14 03:53:46'),
(8, 23, 'Automata Teszt Projekt', 'Ez egy Selenium robottal automatikusan létrehozott projekt.', 'videography', 'Budapest', 'fix', 150000.00, '2026-12-31', 'active', 0, 0, 0, '2026-04-14 03:57:36', '2026-04-14 03:57:36');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `project_skills`
--

CREATE TABLE `project_skills` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `skill` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `project_skills`
--

INSERT INTO `project_skills` (`id`, `project_id`, `skill`) VALUES
(17, 4, 'videózás'),
(18, 4, 'rendezvény'),
(19, 4, 'esküvő'),
(20, 4, 'szerkesztés'),
(21, 4, 'színkorrekció'),
(27, 6, 'videózás'),
(28, 6, 'rendezvény'),
(29, 6, 'esküvő'),
(30, 6, 'szerkesztés'),
(31, 6, 'színkorrekció');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `contract_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `reviewee_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `reviews`
--

INSERT INTO `reviews` (`id`, `contract_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 11, 12, 5, NULL, '2026-04-13 23:49:30'),
(2, 2, 11, 12, 2, 'Értékelési test, mukodj', '2026-04-14 00:12:01');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','driver','admin') NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `location` varchar(100) DEFAULT NULL,
  `bio` text,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `availability` varchar(50) DEFAULT NULL,
  `completed_jobs` int DEFAULT '0',
  `rating` decimal(3,2) DEFAULT '0.00',
  `reviews_count` int DEFAULT '0',
  `member_since` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_image` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `verified`, `location`, `bio`, `hourly_rate`, `availability`, `completed_jobs`, `rating`, `reviews_count`, `member_since`, `created_at`, `updated_at`, `profile_image`) VALUES
(1, 'Kovács Péter', 'peter@example.com', '+36 30 123 4567', '$2a$10$YourHashedPasswordHere', 'driver', 1, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2020-03-15', '2026-04-01 14:02:17', '2026-04-01 14:02:17', NULL),
(2, 'Nagy Eszter', 'eszter@example.com', '+36 20 234 5678', '$2a$10$YourHashedPasswordHere', 'driver', 1, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2019-06-20', '2026-04-01 14:02:17', '2026-04-01 14:02:17', NULL),
(3, 'Ingatlan.com Zrt.', 'info@ingatlan.com', NULL, '$2a$10$YourHashedPasswordHere', 'customer', 1, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2018-09-01', '2026-04-01 14:02:17', '2026-04-01 14:02:17', NULL),
(4, 'Győri Ipari Park', 'info@gyoripark.hu', NULL, '$2a$10$YourHashedPasswordHere', 'customer', 1, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2019-11-15', '2026-04-01 14:02:17', '2026-04-01 14:02:17', NULL),
(11, 'TestM', 'testm@gmail.com', '+06203815718', '$2b$10$fHLlwVUWglORs.DTjDZdMuyQnYjwFTe/IUl2EmDsHwheYlvLKpVzO', 'customer', 0, 'Keszthely', 'Megbízói tesztfiók', NULL, '', 0, 0.00, 0, NULL, '2026-04-11 14:21:12', '2026-04-13 22:11:03', 'http://localhost:5000/uploads/1776118256908-631572473.gif'),
(12, 'TestP', 'testp@gmail.com', '+06203845157', '$2b$10$4aQZnGFyHHICH4XikCYKo.mhT0O0Nku8gw6K27/LjpnM5fJjR/XBa', 'driver', 0, 'Keszthely', ' TestP  TestP  TestP  TestP  TestP  TestP', 15000.00, 'full_time', 2, 3.50, 2, NULL, '2026-04-11 14:21:46', '2026-04-14 00:12:01', 'http://localhost:5000/uploads/1776117984842-155516125.jpg'),
(13, 'TestA', 'testa@gmail.com', '+36203467257', '$2b$10$eku3ke0FqBgDJmjXTSZFFeO1ZJ7gncfCwpKCJsm3k/LzAN/oAPenm', 'admin', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, NULL, '2026-04-11 14:23:16', '2026-04-11 14:23:47', NULL),
(14, 'Csák Roland', 'roland.csak56@gmail.com', '+36203813556', '$2a$10$3IISTM9KJB.93RRs0V9CXOz0QE3s5F3acTC5C/IETZ.sJXxpfYfvG', 'driver', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, NULL, '2026-04-11 18:04:37', '2026-04-13 23:22:05', NULL),
(15, 'Telefonszamtest', 'tefe@gmail.com', '+36345213556', '$2b$10$w5MtvyNcywNIZrl8EjFthetglzt6KmjVofe/CJVYbMs1h8t4DtLbK', 'customer', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-13', '2026-04-13 11:34:30', '2026-04-13 11:34:30', NULL),
(16, 'TestP2', 'testp2@gmail.com', '+36232679146', '$2b$10$wpSKWxES1QqE.VONGBdBYuAlUMJaJv/UHJGU5IzUSO6xufRNkSiGu', 'driver', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-13', '2026-04-13 16:45:53', '2026-04-13 16:45:53', NULL),
(17, 'Selenium Megbízó', 'customer_1776137073074@example.com', NULL, '$2a$10$6kauvMvauOcTRdN46HoxRu3d5PCjORajggc9Of/hVHA2Q1b5f4g66', 'customer', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:24:36', '2026-04-14 03:24:36', NULL),
(18, 'Selenium Pilóta', 'pilot_1776137073074@example.com', NULL, '$2a$10$r2Rv3aLybfyQDuF4xa8P2OWM4xdRAkWjItZ.iqtkIuigqM797YFCe', 'driver', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:24:51', '2026-04-14 03:24:51', NULL),
(19, 'Selenium Megbízó', 'customer_1776138270625@example.com', NULL, '$2a$10$svqhW/Pf8/nKB/T2bxMPE.eqx7yPF9KIXbnBJL1F5LuL3U1E3eUTS', 'customer', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:44:35', '2026-04-14 03:44:35', NULL),
(20, 'Selenium Pilóta', 'pilot_1776138270625@example.com', NULL, '$2a$10$D6vfq98H3XHclLSFbyAmYe1C6Ze0JSHKwTJz3hecHqwTkH3dn4UBW', 'driver', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:44:48', '2026-04-14 03:44:48', NULL),
(21, 'Selenium Megbízó', 'customer_1776138805986@example.com', NULL, '$2a$10$dhKTLVnLjLCitdIm101Xx.B87u4ifM25WxehaMu/EUg7kXTLmPRbC', 'customer', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:53:41', '2026-04-14 03:53:41', NULL),
(22, 'Selenium Pilóta', 'pilot_1776138805986@example.com', NULL, '$2a$10$5K8jQKoT9YdkF9qU4mSSD.4JUQbOYjiOCJPe.tSB.gNFa9EDtNViS', 'driver', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:53:49', '2026-04-14 03:53:49', NULL),
(23, 'Selenium Megbízó', 'customer_1776139047051@example.com', NULL, '$2a$10$zdR5ubJPMTo48Rba1WqwH.5mswkNSD7GiWmuhZV0ZxuiFgEWFJ7yu', 'customer', 0, NULL, NULL, NULL, NULL, 0, 0.00, 0, '2026-04-14', '2026-04-14 03:57:31', '2026-04-14 03:57:31', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `skill` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `user_skills`
--

INSERT INTO `user_skills` (`id`, `user_id`, `skill`) VALUES
(41, 12, 'Ipari ellenőr'),
(42, 12, 'Drónvideós'),
(43, 12, 'Drónfotós'),
(44, 12, 'FPV pilóta');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- A tábla indexei `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `bid_id` (`bid_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- A tábla indexei `contract_milestones`
--
ALTER TABLE `contract_milestones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- A tábla indexei `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `project_skills`
--
ALTER TABLE `project_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contract_id` (`contract_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `reviewee_id` (`reviewee_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- A tábla indexei `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `bids`
--
ALTER TABLE `bids`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `contract_milestones`
--
ALTER TABLE `contract_milestones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT a táblához `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `project_skills`
--
ALTER TABLE `project_skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_4` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `contract_milestones`
--
ALTER TABLE `contract_milestones`
  ADD CONSTRAINT `contract_milestones_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `portfolio`
--
ALTER TABLE `portfolio`
  ADD CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `project_skills`
--
ALTER TABLE `project_skills`
  ADD CONSTRAINT `project_skills_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
