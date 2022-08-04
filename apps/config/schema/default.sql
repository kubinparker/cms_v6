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
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `configs`
--

INSERT INTO `configs` (`id`, `title`, `slug`, `is_default`, `created`, `modified`) VALUES
(2, '設定', 'configs', 1, '2022-07-14 10:58:40', NULL),
(3, 'ユーザー', 'users', 1, '2022-07-14 10:58:40', NULL),
(4, '添付', 'attached', 1, '2022-07-14 10:59:39', NULL);

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
(1, '2022-07-04 17:49:36', '2022-07-05 15:50:34', 'admin', '$2y$10$hp8PDeHBvG26x7c6nB.iVuB0rl0FGZXtirB15wnHWfwJ5GYKVMd0C', 'Admin', 'develop+cms6_admin@caters.co.jp', 'publish', 0); --caters--
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `configs`
--
ALTER TABLE `configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
