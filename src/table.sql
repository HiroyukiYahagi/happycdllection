-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jun 22, 2016 at 06:46 AM
-- Server version: 5.5.38-log
-- PHP Version: 5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `happytuning`
--
CREATE DATABASE IF NOT EXISTS `happytuning` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `happytuning`;

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--

CREATE TABLE `tweets` (
`id` int(30) NOT NULL,
  `tweet_id` int(30) NOT NULL,
  `tweet_text` mediumtext NOT NULL,
  `created` varchar(256) NOT NULL,
  `user_id` int(30) NOT NULL,
  `like_count` int(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `twitter_users`
--

CREATE TABLE `twitter_users` (
`id` int(30) NOT NULL,
  `user_id` int(30) NOT NULL,
  `user_name` varchar(256) NOT NULL,
  `user_img_url` mediumtext NOT NULL,
  `user_screen_name` varchar(256) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=472 DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tweets`
--
ALTER TABLE `tweets`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `twitter_users`
--
ALTER TABLE `twitter_users`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tweets`
--
ALTER TABLE `tweets`
MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `twitter_users`
--
ALTER TABLE `twitter_users`
MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=472;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tweets`
--
ALTER TABLE `tweets`
ADD CONSTRAINT `fk_tweets_user_id` FOREIGN KEY (`user_id`) REFERENCES `twitter_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
