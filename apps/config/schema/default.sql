SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE TABLE `configs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `configs` (`id`, `title`, `slug`, `is_default`, `created`, `modified`) VALUES
(NULL, '設定', 'configs', '1', CURRENT_TIMESTAMP, NULL),
(NULL, '添付', 'attached', '1', CURRENT_TIMESTAMP, NULL),
(NULL, 'ユーザー', 'users', '1', CURRENT_TIMESTAMP, NULL);


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


INSERT INTO `users` (`id`, `created`, `modified`, `username`, `password`, `name`, `email`, `status`, `role`) VALUES
(1, '2022-07-04 17:49:36', '2022-07-05 15:50:34', 'admin', '$2y$10$hp8PDeHBvG26x7c6nB.iVuB0rl0FGZXtirB15wnHWfwJ5GYKVMd0C', 'Admin', 'develop+cms6_admin@caters.co.jp', 'publish', 0);


ALTER TABLE `configs`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


CREATE TABLE `attached` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL COMMENT 'Slugに合わせてテーブルのID',
  `slug` varchar(20) NOT NULL,
  `file_name` varchar(255) NOT NULL COMMENT 'ファイル名',
  `original_file_name` varchar(255) NOT NULL COMMENT '元ファイル名',
  `size` int(11) NULL,
  `extension` varchar(4) NOT NULL COMMENT 'ファイル拡大',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `attached`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `attached`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;