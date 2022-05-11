CREATE TABLE "public"."provinces" (
    "id" int4 NOT NULL,
    "name" varchar(19) COLLATE "pg_catalog"."default" NOT NULL,
    "slug" varchar(17) COLLATE "pg_catalog"."default" NOT NULL
);

INSERT INTO
    "public"."provinces"
VALUES
    (1, 'آذربایجان شرقی', 'آذربایجان-شرقی');

INSERT INTO
    "public"."provinces"
VALUES
    (2, 'آذربایجان غربی', 'آذربایجان-غربی');

INSERT INTO "public"."provinces" VALUES (3, 'اردبیل', 'اردبیل');

INSERT INTO "public"."provinces" VALUES (4, 'اصفهان', 'اصفهان');

INSERT INTO "public"."provinces" VALUES (5, 'البرز', 'البرز');

INSERT INTO "public"."provinces" VALUES (6, 'ایلام', 'ایلام');

INSERT INTO "public"."provinces" VALUES (7, 'بوشهر', 'بوشهر');

INSERT INTO "public"."provinces" VALUES (8, 'تهران', 'تهران');

INSERT INTO
    "public"."provinces"
VALUES
    (9, 'چهارمحال و بختیاری', 'چهارمحال-بختیاری');

INSERT INTO
    "public"."provinces"
VALUES
    (10, 'خراسان جنوبی', 'خراسان-جنوبی');

INSERT INTO
    "public"."provinces"
VALUES
    (11, 'خراسان رضوی', 'خراسان-رضوی');

INSERT INTO
    "public"."provinces"
VALUES
    (12, 'خراسان شمالی', 'خراسان-شمالی');

INSERT INTO "public"."provinces" VALUES (13, 'خوزستان', 'خوزستان');

INSERT INTO "public"."provinces" VALUES (14, 'زنجان', 'زنجان');

INSERT INTO "public"."provinces" VALUES (15, 'سمنان', 'سمنان');

INSERT INTO
    "public"."provinces"
VALUES
    (16, 'سیستان و بلوچستان', 'سیستان-بلوچستان');

INSERT INTO "public"."provinces" VALUES (17, 'فارس', 'فارس');

INSERT INTO "public"."provinces" VALUES (18, 'قزوین', 'قزوین');

INSERT INTO "public"."provinces" VALUES (19, 'قم', 'قم');

INSERT INTO "public"."provinces" VALUES (20, 'کردستان', 'کردستان');

INSERT INTO "public"."provinces" VALUES (21, 'کرمان', 'کرمان');

INSERT INTO "public"."provinces" VALUES (22, 'کرمانشاه', 'کرمانشاه');

INSERT INTO
    "public"."provinces"
VALUES
    (23, 'کهگیلویه و بویراحمد', 'کهگیلویه-بویراحمد');

INSERT INTO "public"."provinces" VALUES (24, 'گلستان', 'گلستان');

INSERT INTO "public"."provinces" VALUES (25, 'لرستان', 'لرستان');

INSERT INTO "public"."provinces" VALUES (26, 'گیلان', 'گیلان');

INSERT INTO "public"."provinces" VALUES (27, 'مازندران', 'مازندران');

INSERT INTO "public"."provinces" VALUES (28, 'مرکزی', 'مرکزی');

INSERT INTO "public"."provinces" VALUES (29, 'هرمزگان', 'هرمزگان');

INSERT INTO "public"."provinces" VALUES (30, 'همدان', 'همدان');

INSERT INTO "public"."provinces" VALUES (31, 'یزد', 'یزد');

-- ----------------------------

-- Primary Key structure for table provinces

-- ----------------------------

ALTER TABLE
    "public"."provinces"
ADD
    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id");