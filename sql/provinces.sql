/*
 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 100130
 Source Host           : localhost:3306

 Target Server Type    : MySQL
 Target Server Version : 100130
 File Encoding         : 65001

 Date: 01/03/2018 11:47:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `provinces_name_unique`(`name`) USING BTREE,
  UNIQUE INDEX `provinces_slug_unique`(`slug`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of provinces
-- ----------------------------
INSERT INTO `provinces` VALUES (1, 'آذربایجان شرقی', 'آذربایجان-شرقی');
INSERT INTO `provinces` VALUES (2, 'آذربایجان غربی', 'آذربایجان-غربی');
INSERT INTO `provinces` VALUES (3, 'اردبیل', 'اردبیل');
INSERT INTO `provinces` VALUES (4, 'اصفهان', 'اصفهان');
INSERT INTO `provinces` VALUES (5, 'البرز', 'البرز');
INSERT INTO `provinces` VALUES (6, 'ایلام', 'ایلام');
INSERT INTO `provinces` VALUES (7, 'بوشهر', 'بوشهر');
INSERT INTO `provinces` VALUES (8, 'تهران', 'تهران');
INSERT INTO `provinces` VALUES (9, 'چهارمحال و بختیاری', 'چهارمحال-و-بختیاری');
INSERT INTO `provinces` VALUES (10, 'خراسان جنوبی', 'خراسان-جنوبی');
INSERT INTO `provinces` VALUES (11, 'خراسان رضوی', 'خراسان-رضوی');
INSERT INTO `provinces` VALUES (12, 'خراسان شمالی', 'خراسان-شمالی');
INSERT INTO `provinces` VALUES (13, 'خوزستان', 'خوزستان');
INSERT INTO `provinces` VALUES (14, 'زنجان', 'زنجان');
INSERT INTO `provinces` VALUES (15, 'سمنان', 'سمنان');
INSERT INTO `provinces` VALUES (16, 'سیستان و بلوچستان', 'سیستان-و-بلوچستان');
INSERT INTO `provinces` VALUES (17, 'فارس', 'فارس');
INSERT INTO `provinces` VALUES (18, 'قزوین', 'قزوین');
INSERT INTO `provinces` VALUES (19, 'قم', 'قم');
INSERT INTO `provinces` VALUES (20, 'کردستان', 'کردستان');
INSERT INTO `provinces` VALUES (21, 'کرمان', 'کرمان');
INSERT INTO `provinces` VALUES (22, 'کرمانشاه', 'کرمانشاه');
INSERT INTO `provinces` VALUES (23, 'کهگیلویه و بویراحمد', 'کهگیلویه-و-بویراحمد');
INSERT INTO `provinces` VALUES (24, 'گلستان', 'گلستان');
INSERT INTO `provinces` VALUES (25, 'لرستان', 'لرستان');
INSERT INTO `provinces` VALUES (26, 'گیلان', 'گیلان');
INSERT INTO `provinces` VALUES (27, 'مازندران', 'مازندران');
INSERT INTO `provinces` VALUES (28, 'مرکزی', 'مرکزی');
INSERT INTO `provinces` VALUES (29, 'هرمزگان', 'هرمزگان');
INSERT INTO `provinces` VALUES (30, 'همدان', 'همدان');
INSERT INTO `provinces` VALUES (31, 'یزد', 'یزد');

SET FOREIGN_KEY_CHECKS = 1;
