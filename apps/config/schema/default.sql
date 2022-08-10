-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 10, 2022 at 08:09 AM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cms_v6`
--

-- --------------------------------------------------------

--
-- Table structure for table `attached`
--

CREATE TABLE `attached` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL COMMENT 'Slugに合わせてテーブルのID',
  `slug` varchar(20) NOT NULL,
  `file_name` varchar(255) NOT NULL COMMENT 'ファイル名',
  `original_file_name` varchar(255) NOT NULL COMMENT '元ファイル名',
  `size` int(11) DEFAULT NULL,
  `extension` varchar(4) NOT NULL COMMENT 'ファイル拡大',
  `type` enum('images','files') NOT NULL DEFAULT 'images',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `configs`
--

CREATE TABLE `configs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(20) NOT NULL,
  `is_default` int(1) NOT NULL DEFAULT '0' COMMENT '１デフォルトテーブル',
  `lang` enum('jp','en') NOT NULL DEFAULT 'jp',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `configs`
--

INSERT INTO `configs` (`id`, `title`, `slug`, `is_default`, `lang`, `created`, `modified`) VALUES
(2, '設定', 'configs', 1, 'jp', '2022-07-14 10:58:40', NULL),
(3, 'ユーザー', 'users', 1, 'jp', '2022-07-14 10:58:40', NULL),
(4, '添付', 'attached', 1, 'jp', '2022-07-14 10:59:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日',
  `username` varchar(30) NOT NULL COMMENT 'ログインアカウント',
  `password` varchar(200) NOT NULL COMMENT 'パスワード',
  `name` varchar(60) NOT NULL COMMENT '氏名',
  `email` varchar(60) NOT NULL COMMENT 'メールアドレス',
  `status` enum('draft','publish') NOT NULL DEFAULT 'publish' COMMENT 'ステイタス',
  `role` int(11) NOT NULL DEFAULT '0' COMMENT '権限'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created`, `modified`, `username`, `password`, `name`, `email`, `status`, `role`) VALUES
(1, '2022-07-04 17:49:36', '2022-07-28 09:27:23', 'develop', '$2y$10$WyHYQwl4Ax5cdCQhU6MiA.8Du5q5bPh23XahHpvQDgHnGbnEV.VKW', 'Admin', 'develop+cms6@caters.co.jp', 'publish', 0),
(2, '2022-07-28 09:22:41', NULL, 'admin', '$2y$10$4jlEDUbYL7u2uE8hYo9jh.5h27c0FoXuPa5thO1zp7fdMbmsU1ceK', 'MIZ', 'admin+cms6@caters.co.jp', 'publish', 1),
(3, '2022-08-01 05:04:41', NULL, 'staff', '$2y$10$FRXEt5J38.SDzSrQeM95ReBGHM0ZTrb/PPEZuNj5i3z0Rn7tp.Vpq', 'MIZ', 'staff+cms6@caters.co.jp', 'publish', 10);


-- Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
--
-- Licensed under The MIT License
-- For full copyright and license information, please see the LICENSE.txt
-- Redistributions of files must retain the above copyright notice.
-- MIT License (https://opensource.org/licenses/mit-license.php)

CREATE TABLE `sessions` (
  `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP, -- optional, requires MySQL 5.6.5+
  `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- optional, requires MySQL 5.6.5+
  `data` blob DEFAULT NULL, -- for PostgreSQL use bytea instead of blob
  `expires` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attached`
--
ALTER TABLE `attached`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `configs`
--
ALTER TABLE `configs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attached`
--
ALTER TABLE `attached`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `configs`
--
ALTER TABLE `configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
