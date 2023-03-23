CREATE TABLE "org.enc.sp".resources
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    locale character varying(6) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    image bytea,
    image_name character varying COLLATE pg_catalog."default",
    sound bytea,
    sound_name character varying COLLATE pg_catalog."default",
    CONSTRAINT resources_pkey PRIMARY KEY (id, locale)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "org.enc.sp".resources
    OWNER to postgres;