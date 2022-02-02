SET GLOBAL log_bin_trust_function_creators = 1;
CREATE FUNCTION get_next_interval_start_date(input_date DATE) RETURNS DATE DETERMINISTIC
RETURN DATE_ADD(LAST_DAY(DATE_SUB(input_date, INTERVAL 5 DAY)), INTERVAL 6 DAY);

CREATE FUNCTION get_current_interval_start_date() RETURNS DATE
RETURN DATE_SUB(get_next_interval_start_date(CURRENT_DATE()), INTERVAL 1 MONTH);

CREATE FUNCTION get_month_start(input_date DATE) RETURNS DATE DETERMINISTIC
RETURN DATE_SUB(DATE_ADD(LAST_DAY(input_date), INTERVAL 1 DAY), INTERVAL 1 MONTH);