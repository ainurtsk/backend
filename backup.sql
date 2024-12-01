--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: products_product_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_product_category_enum AS ENUM (
    'Vegetables',
    'Fruits',
    'Seeds',
    'Equipment'
);


ALTER TYPE public.products_product_category_enum OWNER TO postgres;

--
-- Name: calculate_order_detail_total(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_order_detail_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Calculate total_price as quantity * product_price
    NEW.total_price := NEW.quantity * (
        SELECT product_price
        FROM Product
        WHERE product_id = NEW.product_id
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_order_detail_total() OWNER TO postgres;

--
-- Name: update_payment_total_cost(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_payment_total_cost() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Calculate total_cost as the sum of total_price in OrderDetails + delivery_cost
    UPDATE Payment
    SET total_cost = (
        SELECT 
            COALESCE(SUM(od.total_price), 0) + COALESCE(d.delivery_cost, 0)
        FROM 
            OrderDetails od
        JOIN 
            Delivery d ON od.order_id = d.order_id
        WHERE 
            od.order_id = NEW.order_id
    )
    WHERE 
        order_id = NEW.order_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_payment_total_cost() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buyer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyer (
    buyer_id integer NOT NULL,
    buyer_name character varying(100) NOT NULL,
    buyer_surname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(15) NOT NULL,
    address text NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.buyer OWNER TO postgres;

--
-- Name: buyer_buyer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buyer_buyer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buyer_buyer_id_seq OWNER TO postgres;

--
-- Name: buyer_buyer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buyer_buyer_id_seq OWNED BY public.buyer.buyer_id;


--
-- Name: delivery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery (
    delivery_id integer NOT NULL,
    order_id integer,
    farmer_id integer,
    delivery_method character varying(50) NOT NULL,
    delivery_status character varying(50) DEFAULT 'Processing'::character varying,
    delivery_date date NOT NULL,
    delivery_cost numeric(10,2) NOT NULL
);


ALTER TABLE public.delivery OWNER TO postgres;

--
-- Name: farmer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farmer (
    farmer_id integer NOT NULL,
    farmer_name character varying(100) NOT NULL,
    farmer_surname character varying(100) NOT NULL,
    farmer_email character varying(100) NOT NULL,
    phone_number character varying(15) NOT NULL,
    farm_location character varying(255),
    gov_id character varying(50) NOT NULL,
    crops text,
    profile_image character varying(255),
    farm_name character varying(100) NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.farmer OWNER TO postgres;

--
-- Name: farmer_farmer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.farmer_farmer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.farmer_farmer_id_seq OWNER TO postgres;

--
-- Name: farmer_farmer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.farmer_farmer_id_seq OWNED BY public.farmer.farmer_id;


--
-- Name: orderdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderdetails (
    order_detail_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    total_price numeric(10,2)
);


ALTER TABLE public.orderdetails OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    buyer_id integer,
    order_date date DEFAULT CURRENT_DATE NOT NULL,
    order_status character varying(50) DEFAULT 'Pending'::character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orderpaymentsummary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.orderpaymentsummary AS
 SELECT o.order_id,
    sum(od.total_price) AS total_product_price,
    d.delivery_cost,
    (sum(od.total_price) + d.delivery_cost) AS total_cost
   FROM ((public.orders o
     JOIN public.orderdetails od ON ((o.order_id = od.order_id)))
     JOIN public.delivery d ON ((o.order_id = d.order_id)))
  GROUP BY o.order_id, d.delivery_cost;


ALTER VIEW public.orderpaymentsummary OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    order_id integer,
    payment_status character varying(50) DEFAULT 'Pending'::character varying,
    payment_method character varying(50) NOT NULL,
    payment_date date DEFAULT CURRENT_DATE,
    total_cost numeric(10,2)
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    farmer_id integer,
    product_name character varying(100) NOT NULL,
    product_category character varying(50),
    category character varying(50),
    product_price numeric(10,2) NOT NULL,
    product_quantity integer NOT NULL,
    product_description text,
    CONSTRAINT product_category_check CHECK (((category)::text = ANY ((ARRAY['Vegetables'::character varying, 'Fruits'::character varying, 'Seeds'::character varying, 'Equipment'::character varying])::text[])))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    product_description text NOT NULL,
    product_price numeric(10,2) NOT NULL,
    product_quantity integer NOT NULL,
    product_category public.products_product_category_enum NOT NULL,
    "farmerFarmerId" integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: buyer buyer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer ALTER COLUMN buyer_id SET DEFAULT nextval('public.buyer_buyer_id_seq'::regclass);


--
-- Name: farmer farmer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmer ALTER COLUMN farmer_id SET DEFAULT nextval('public.farmer_farmer_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Data for Name: buyer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyer (buyer_id, buyer_name, buyer_surname, email, phone_number, address, password) FROM stdin;
\.


--
-- Data for Name: delivery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery (delivery_id, order_id, farmer_id, delivery_method, delivery_status, delivery_date, delivery_cost) FROM stdin;
\.


--
-- Data for Name: farmer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.farmer (farmer_id, farmer_name, farmer_surname, farmer_email, phone_number, farm_location, gov_id, crops, profile_image, farm_name, password) FROM stdin;
1	Anuar	Taskynov	anuar.taskynova@gmail.com	87719754200	Central	Aa1234	\N	\N	DeltaSolution	$2b$10$2BZ.7jG97pXXH1UaxPflMeXxKyg5/eP0Tp5oyieFH1RqQzQ7dMh9m
\.


--
-- Data for Name: orderdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderdetails (order_detail_id, order_id, product_id, quantity, total_price) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, buyer_id, order_date, order_status) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (payment_id, order_id, payment_status, payment_method, payment_date, total_cost) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (product_id, farmer_id, product_name, product_category, category, product_price, product_quantity, product_description) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, product_description, product_price, product_quantity, product_category, "farmerFarmerId") FROM stdin;
1	Tomatoes	Fresh organic tomatoes	3.50	100	Vegetables	1
2	Strawberries	Fresh organic strawberries	4.50	50	Fruits	1
\.


--
-- Name: buyer_buyer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buyer_buyer_id_seq', 1, false);


--
-- Name: farmer_farmer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.farmer_farmer_id_seq', 1, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 2, true);


--
-- Name: products PK_a8940a4bf3b90bd7ac15c8f4dd9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_a8940a4bf3b90bd7ac15c8f4dd9" PRIMARY KEY (product_id);


--
-- Name: farmer UQ_4f912948a98bdb64f915dec3e30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmer
    ADD CONSTRAINT "UQ_4f912948a98bdb64f915dec3e30" UNIQUE (farmer_email, phone_number);


--
-- Name: buyer UQ_7f669cc2d2311e6aa520ffb7257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT "UQ_7f669cc2d2311e6aa520ffb7257" UNIQUE (email, phone_number);


--
-- Name: buyer buyer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer
    ADD CONSTRAINT buyer_pkey PRIMARY KEY (buyer_id);


--
-- Name: delivery delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_pkey PRIMARY KEY (delivery_id);


--
-- Name: farmer farmer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmer
    ADD CONSTRAINT farmer_pkey PRIMARY KEY (farmer_id);


--
-- Name: orderdetails orderdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetails
    ADD CONSTRAINT orderdetails_pkey PRIMARY KEY (order_detail_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: orderdetails calculate_order_detail_total_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_order_detail_total_trigger BEFORE INSERT OR UPDATE ON public.orderdetails FOR EACH ROW EXECUTE FUNCTION public.calculate_order_detail_total();


--
-- Name: products FK_6d57b8e974376161003d4e0aebb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_6d57b8e974376161003d4e0aebb" FOREIGN KEY ("farmerFarmerId") REFERENCES public.farmer(farmer_id) ON DELETE CASCADE;


--
-- Name: delivery delivery_farmer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_farmer_id_fkey FOREIGN KEY (farmer_id) REFERENCES public.farmer(farmer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: delivery delivery_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orderdetails orderdetails_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetails
    ADD CONSTRAINT orderdetails_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orderdetails orderdetails_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetails
    ADD CONSTRAINT orderdetails_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.buyer(buyer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_farmer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_farmer_id_fkey FOREIGN KEY (farmer_id) REFERENCES public.farmer(farmer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

