CREATE TABLE "public"."provinces" (
    "id" int4 NOT NULL,
    "name" varchar(19) COLLATE "pg_catalog"."default" NOT NULL,
    "slug" varchar(17) COLLATE "pg_catalog"."default" NOT NULL,
    "tel_prefix" varchar(3) COLLATE "pg_catalog"."default" NOT NULL
);

INSERT INTO
    "public"."provinces"
VALUES
    (1, 'آذربایجان شرقی', 'آذربایجان-شرقی', '041');

INSERT INTO
    "public"."provinces"
VALUES
    (2, 'آذربایجان غربی', 'آذربایجان-غربی', '044');

INSERT INTO "public"."provinces" VALUES (3, 'اردبیل', 'اردبیل', '045');

INSERT INTO "public"."provinces" VALUES (4, 'اصفهان', 'اصفهان', '031');

INSERT INTO "public"."provinces" VALUES (5, 'البرز', 'البرز', '026');

INSERT INTO "public"."provinces" VALUES (6, 'ایلام', 'ایلام'), '084';

INSERT INTO "public"."provinces" VALUES (7, 'بوشهر', 'بوشهر'), '077';

INSERT INTO "public"."provinces" VALUES (8, 'تهران', 'تهران', '021');

INSERT INTO
    "public"."provinces"
VALUES
    (9, 'چهارمحال و بختیاری', 'چهارمحال-بختیاری'), '038';

INSERT INTO
    "public"."provinces"
VALUES
    (10, 'خراسان جنوبی', 'خراسان-جنوبی', '056');

INSERT INTO
    "public"."provinces"
VALUES
    (11, 'خراسان رضوی', 'خراسان-رضوی', '051');

INSERT INTO
    "public"."provinces"
VALUES
    (12, 'خراسان شمالی', 'خراسان-شمالی'), '058';

INSERT INTO "public"."provinces" VALUES (13, 'خوزستان', 'خوزستان', '061');

INSERT INTO "public"."provinces" VALUES (14, 'زنجان', 'زنجان'), '024';

INSERT INTO "public"."provinces" VALUES (15, 'سمنان', 'سمنان', '023');

INSERT INTO
    "public"."provinces"
VALUES
    (16, 'سیستان و بلوچستان', 'سیستان-بلوچستان', '054');

INSERT INTO "public"."provinces" VALUES (17, 'فارس', 'فارس', '071');

INSERT INTO "public"."provinces" VALUES (18, 'قزوین', 'قزوین', '028');

INSERT INTO "public"."provinces" VALUES (19, 'قم', 'قم', '025');

INSERT INTO "public"."provinces" VALUES (20, 'کردستان', 'کردستان', '087');

INSERT INTO "public"."provinces" VALUES (21, 'کرمان', 'کرمان', '034');

INSERT INTO "public"."provinces" VALUES (22, 'کرمانشاه', 'کرمانشاه'), '083';

INSERT INTO
    "public"."provinces"
VALUES
    (23, 'کهگیلویه و بویراحمد', 'کهگیلویه-بویراحمد'), '074';

INSERT INTO "public"."provinces" VALUES (24, 'گلستان', 'گلستان'), '017';

INSERT INTO "public"."provinces" VALUES (25, 'لرستان', 'لرستان'), '066';

INSERT INTO "public"."provinces" VALUES (26, 'گیلان', 'گیلان', '013');

INSERT INTO "public"."provinces" VALUES (27, 'مازندران', 'مازندران'), '011';

INSERT INTO "public"."provinces" VALUES (28, 'مرکزی', 'مرکزی', '086');

INSERT INTO "public"."provinces" VALUES (29, 'هرمزگان', 'هرمزگان', '076');

INSERT INTO "public"."provinces" VALUES (30, 'همدان', 'همدان', '081');

INSERT INTO "public"."provinces" VALUES (31, 'یزد', 'یزد', '035');

-- ----------------------------

-- Primary Key structure for table provinces

-- ----------------------------

ALTER TABLE
    "public"."provinces"
ADD
    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id");